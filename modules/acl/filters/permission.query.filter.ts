import { SelectQueryBuilder } from 'typeorm';
import AccessQueryFilter from './access.query.filter';
import PermissionEntity from '../entities/permission.entity';

export default class PermissionQueryFilter extends AccessQueryFilter {
  userId(
    qb: SelectQueryBuilder<PermissionEntity>,
    userId: string
  ): PermissionQueryFilter {
    qb.innerJoin('user_permissions', 'up', 'up.usersId = :userId', {
      userId,
    });
    return this;
  }
}
