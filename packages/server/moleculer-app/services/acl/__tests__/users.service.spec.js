const { ServiceBroker, Errors: { MoleculerClientError } } = require('moleculer');
const JoiValidator = require('../../../utils/joi.validator');
const UsersService = require('../users.service');
const FindEntityMiddleware = require('../../../middlewares/find-entity');

describe('Test acl.users.service', () => {
  const broker = new ServiceBroker({
    logger: false,
    validator: new JoiValidator(),
    middlewares: [FindEntityMiddleware],
  });

  const mailSend = jest.fn();
  broker.createService({
    name: 'service.mail',
    version: 1,
    actions: {
      send: mailSend,
    },
  });

  const service = broker.createService(UsersService);

  const resetPassword = jest.fn();
  broker.createService(UsersService, {
    name: 'user-create',
    actions: {
      resetPassword: {
        handler: resetPassword,
      },
    },
  });

  const adminMeta = {
    user: { accountType: 'SERVICE' },
    userPermissions: ['user.create'],
  };

  const { model } = service.adapter;

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  beforeEach(async () => {
    await model.deleteMany({});
    resetPassword.mockClear();
    mailSend.mockClear();
  });

  describe('Test methods', () => {
    describe('isEntityOwner method', () => {
      it('should be owner of itself', () => {
        expect(service.isEntityOwner({ meta: { user: { _id: 'user-1' } }, params: { id: 'user-1' } })).toBeTruthy();
      });

      it('should not be owner of another user', () => {
        expect(service.isEntityOwner({ meta: { user: { _id: 'user-2' } }, params: { id: 'user-1' } })).toBeFalsy();
      });
    });

    describe('limitToServiceAccounts method', () => {
      it('should skip accountType != Service account', () => {
        const ctx = {
          meta: { user: { accountType: 'SERVICE' } },
          params: { accountType: 'BARMAN' },
          locals: {},
        };

        expect(() => service.limitToServiceAccounts(ctx)).not.toThrow();
      });

      it('should throw if current user != Service account', () => {
        const ctx = {
          meta: { user: { accountType: 'BARMAN' } },
          params: { accountType: 'SERVICE' },
          locals: {},
        };

        expect(() => service.limitToServiceAccounts(ctx)).toThrow(MoleculerClientError);
      });

      function testMethod({ user, current, next }) {
        return () => service.limitToServiceAccounts({
          meta: { userPermissions: user, user: { accountType: 'SERVICE' } },
          locals: { entity: current ? { accountType: 'SERVICE', account: { permissions: current } } : null },
          params: { accountType: 'SERVICE', account: { permissions: next } },
        });
      }

      it.each([
        { user: ['a'], current: ['a'], next: [] },
        { user: [], current: ['a'], next: ['a'] },
        { user: ['a'], current: null, next: ['a'] },
        { user: ['b'], current: ['a', 'b'], next: ['a'] },
        { user: ['a', 'b'], current: ['a', 'b'], next: [] },
      ])('should pass with permissions %j', (preset) => {
        expect(testMethod(preset)).not.toThrow();
      });

      it.each([
        { user: [], current: [], next: ['a'] },
        { user: [], current: null, next: ['a'] },
        { user: ['a'], current: ['a', 'b'], next: ['a'] },
        { user: ['b'], current: null, next: ['a'] },
      ])('should throw with permissions %j', (preset) => {
        expect(testMethod(preset)).toThrow(MoleculerClientError);
      });
    });

    describe('remoteSensitiveData method', () => {
      it('should remove tokens and password when entity is returned', () => {
        const data = {
          password: 'argon2Hash',
          passwordToken: 'anotherOne',
          emailToken: 'andAgainAnotherOne',
        };

        const res = service.removeSensitiveData({}, data);

        expect(res).not.toHaveProperty('password');
        expect(res).not.toHaveProperty('passwordToken');
        expect(res).not.toHaveProperty('emailToken');
      });

      it('should remove tokens and password when rows are returned', () => {
        const data = {
          password: 'argon2Hash',
        };

        const res = service.removeSensitiveData({}, { rows: [data, data] });

        expect.assertions(2);
        res.rows.forEach(r => expect(r).not.toHaveProperty('password'));
      });

      it('should leave not sensitive fields', () => {
        const data = {
          password: 'argon2Hash',
          otherField: 'AnotherField',
        };

        const res = service.removeSensitiveData({}, data);

        expect(res).not.toHaveProperty('password');
        expect(res).toHaveProperty('otherField');
      });

      it('should not fail if no data', () => {
        const res = service.removeSensitiveData({}, null);

        expect(res).toBe(null);
      });
    });

    describe('getUserByEmail method', () => {
      it('should populate locals with user', async () => {
        await model.create({ email: 'test@example.com', accountType: 'SERVICE', account: {} });

        const ctx = { params: { email: 'test@example.com' }, locals: {} };

        expect(await service.getUserByEmail(ctx)).toBeUndefined();
        expect(ctx.locals.user).toBeDefined();
      });

      it('should fail silently if no user', async () => {
        const ctx = { params: { email: 'unknown@example.com' }, locals: {} };

        expect(await service.getUserByEmail(ctx)).toBeUndefined();
        expect(ctx.locals.user).not.toBeDefined();
      });
    });
  });

  describe('Test actions', () => {
    describe('create action', () => {
      it('should create a simple barman', async () => {
        const data = {
          email: 'test+barman@example.com',
          accountType: 'BARMAN',
          account: {
            firstName: 'John',
            lastName: 'Doe',
            nickName: 'Jo',
            dateOfBirth: new Date(1997, 3, 23),
          },
        };

        const user = await broker.call('v1.user-create.create', data, { meta: adminMeta });

        expect(user).toMatchObject(data);
        expect(resetPassword).toHaveBeenCalledTimes(1);
        expect(mailSend).toHaveBeenCalledTimes(1);
      });

      it('should create a simple service account', async () => {
        const data = {
          email: 'test+service@example.com',
          accountType: 'SERVICE',
          account: {
            code: '1234',
            description: 'Example service account',
          },
        };

        const user = await broker.call('v1.user-create.create', data, { meta: adminMeta });

        expect(user).toMatchObject(data);
        expect(resetPassword).toHaveBeenCalledTimes(1);
        expect(mailSend).toHaveBeenCalledTimes(1);
      });

      it('should prevent setting password', async () => {
        const data = {
          email: 'test+service@example.com',
          password: 'password',
          accountType: 'SERVICE',
          account: {
            code: '1234',
            description: 'Example service account',
          },
        };

        await expect(broker.call('v1.user-create.create', data, { meta: adminMeta })).rejects
          .toHaveProperty('type', 'VALIDATION_ERROR');
      });
    });

    describe('list action', () => {
      it('should list all users', async () => {
        await model.insertMany([
          { accountType: 'BARMAN', account: {}, email: 'test+1@example.com' },
          { accountType: 'BARMAN', account: {}, email: 'test+2@example.com' },
          { accountType: 'SERVICE', account: {}, email: 'test+3@example.com' },
        ]);

        const list = await broker.call('v1.acl.users.list', {});

        expect(list).toMatchObject({
          rows: [
            expect.objectContaining({ email: 'test+1@example.com' }),
            expect.objectContaining({ email: 'test+2@example.com' }),
            expect.objectContaining({ email: 'test+3@example.com' }),
          ],
        });
      });

      it('should list only barmen', async () => {
        await model.insertMany([
          { accountType: 'BARMAN', account: {}, email: 'test+1@example.com' },
          { accountType: 'BARMAN', account: {}, email: 'test+2@example.com' },
          { accountType: 'SERVICE', account: {}, email: 'test+3@example.com' },
        ]);

        const list = await broker.call('v1.acl.users.list', { accountType: 'BARMAN' });

        expect(list).toMatchObject({
          rows: [
            expect.objectContaining({ email: 'test+1@example.com' }),
            expect.objectContaining({ email: 'test+2@example.com' }),
          ],
        });
      });

      it('should list only service accounts', async () => {
        await model.insertMany([
          { accountType: 'BARMAN', account: {}, email: 'test+1@example.com' },
          { accountType: 'BARMAN', account: {}, email: 'test+2@example.com' },
          { accountType: 'SERVICE', account: {}, email: 'test+3@example.com' },
        ]);

        const list = await broker.call('v1.acl.users.list', { accountType: 'SERVICE' });

        expect(list).toMatchObject({
          rows: [
            expect.objectContaining({ email: 'test+3@example.com' }),
          ],
        });
      });

      it('should list only active barmen', async () => {
        await model.insertMany([
          {
            accountType: 'BARMAN',
            account: { leaveAt: new Date(2018, 1, 21) },
            email: 'test+1@example.com',
          },
          { accountType: 'BARMAN', account: {}, email: 'test+2@example.com' },
        ]);

        const list = await broker.call('v1.acl.users.list', { accountType: 'BARMAN', onlyActive: true });

        expect(list).toMatchObject({
          rows: [
            expect.objectContaining({ email: 'test+2@example.com' }),
          ],
        });
      });

      it('should not apply onlyActive if accountType is SERVICE', async () => {
        await model.insertMany([
          { accountType: 'BARMAN', account: {}, email: 'test+1@example.com' },
          { accountType: 'SERVICE', account: {}, email: 'test+2@example.com' },
        ]);

        const list = await broker.call('v1.acl.users.list', { accountType: 'SERVICE', onlyActive: true });

        expect(list).toMatchObject({
          rows: [
            expect.objectContaining({ email: 'test+2@example.com' }),
          ],
        });
      });
    });

    describe('update action', () => {
      it('should update simple user', async () => {
        const user = (await model.create({
          email: 'test@example.com',
          accountType: 'SERVICE',
          account: {
            code: '1234',
            description: 'Test account',
            permissions: [],
          },
        })).toObject();

        user._id = user._id.toString();
        user.id = user._id;
        user.account.description = 'New description';

        const updated = await broker.call('v1.acl.users.update', user);
        const dbUser = await model.getById(user._id).lean();

        expect(updated.account.description).toEqual('New description');
        expect(dbUser.account.description).toEqual('New description');

      });
    });
  });
});
