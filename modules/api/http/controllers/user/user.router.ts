import express from 'express';
import UserController from './user.controller';
import { permitted } from '../../middlewares/acl';
import { TYPES } from '../../../../../app/config/types';
import { validate } from '../../middlewares/validation';
import UserRoleController from './user.role.controller';
import UserRequest from '../../request/user/user.request';
import container from '../../../../../app/config/inversify.config';
import UserResponseEntity from '../../response/user.response.entity';
import UserFetchRequest from '../../request/user/user.fetch.request';
import RoleQueryFilter from '../../../../acl/filters/role.query.filter';
import UserQueryFilter from '../../../../user/filters/user.query.filter';
import AuthManager from '../../../../integration/modules/auth/auth.manager';
import UserToggleRolesRequest from '../../request/user/user.toggle.roles.request';

const authManager = container.get<AuthManager>(TYPES.AuthManager);
const filter = container.get<UserQueryFilter>(TYPES.UserQueryFilter);
const roleFilter = container.get<RoleQueryFilter>(TYPES.RoleQueryFilter);
const userController = container.get<UserController>(TYPES.UserController);
const userRoleController = container.get<UserRoleController>(
  TYPES.UserRoleController
);

export default express
  .Router()
  .use(authManager.getMiddleware())
  .get('/:userId', filter.apply(UserResponseEntity), userController.fetch)
  .patch(
    '/:id',
    permitted({
      hasRole: ['super-admin'],
      hasPermission: ['*'],
    }),
    filter.apply(),
    userController.patch
  )
  .get(
    '/',
    validate(UserFetchRequest, true),
    filter.apply(UserResponseEntity),
    userController.fetchAll
  )
  .post('/', validate(UserRequest), userController.create)

  // user roles routes
  .get('/:userId/roles', roleFilter.apply(), userRoleController.fetchAll)
  .patch(
    '/:id/roles',
    validate(UserToggleRolesRequest),
    roleFilter.apply(),
    userRoleController.patch
  )
  .delete(
    '/:userId/roles/:roleId',
    permitted({
      hasRole: ['super-admin'],
      hasPermission: ['*'],
    }),
    userRoleController.delete
  );
