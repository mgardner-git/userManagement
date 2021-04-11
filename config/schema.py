import graphene
from django.contrib.auth.models import Group
from graphene_django import DjangoObjectType
from backend.users.models import User


class UserType(DjangoObjectType):
    class Meta:
        name = 'User'
        model = User


class GroupType(DjangoObjectType):
    users = graphene.List(UserType)

    def resolve_users(parent, *args, **kwargs):
        return parent.user_set.all()

    class Meta:
        name = 'Group'
        model = Group


class UserInput(graphene.InputObjectType):
    username = graphene.String(required=True)
    first_name = graphene.String()
    last_name = graphene.String()
    email = graphene.String()
    password = graphene.String()


class GroupInput(graphene.InputObjectType):
    name = graphene.String(required=True)


class CreateUser(graphene.Mutation):
    class Arguments:
        data = UserInput(required=True)

    Output = UserType

    def mutate(self, info, data):
        if 'password' not in data:
            raise Exception('No password provided')
        password = data.pop('password')
        user = User.objects.create(**data)
        user.set_password(password)

        return user


class UpdateUser(graphene.Mutation):
    class Arguments:
        id = graphene.ID()
        data = UserInput(required=True)

    Output = UserType

    def mutate(self, info, id, data):
        password = None
        if 'password' in data:
            password = data.pop('password')

        User.objects.filter(pk=id).update(**data)
        user = User.objects.get(pk=id)

        if password is not None:
            user.set_password(password)

        return user


class DeleteUser(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    Output = graphene.Boolean

    def mutate(self, info, id):
        User.objects.get(pk=id).delete()
        return True


class CreateGroup(graphene.Mutation):
    class Arguments:
        data = GroupInput(required=True)

    Output = GroupType

    def mutate(self, info, data):
        return Group.objects.create(**data)


class UpdateGroup(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        data = GroupInput(required=True)

    Output = GroupType

    def mutate(self, info, id, data):
        Group.objects.filter(pk=id).update(**data)
        return Group.objects.get(pk=id)


class DeleteGroup(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    Output = graphene.Boolean

    def mutate(self, info, id):
        Group.objects.get(pk=id).delete()
        return True


class AddUserToGroup(graphene.Mutation):
    class Arguments:
        group_id = graphene.ID(required=True)
        user_id = graphene.ID(required=True)

    Output = GroupType

    def mutate(self, info, group_id, user_id):
        group = Group.objects.get(pk=group_id)
        user = User.objects.get(pk=user_id)

        group.user_set.add(user)

        return group


class RemoveUserFromGroup(graphene.Mutation):
    class Arguments:
        group_id = graphene.ID(required=True)
        user_id = graphene.ID(required=True)

    Output = GroupType

    def mutate(self, info, group_id, user_id):
        group = Group.objects.get(pk=group_id)
        user = User.objects.get(pk=user_id)

        group.user_set.remove(user)

        return group


class UserMutations(object):
    create_user = CreateUser.Field()
    update_user = UpdateUser.Field()
    delete_user = DeleteUser.Field()


class GroupMutations(object):
    create_group = CreateGroup.Field()
    update_group = UpdateGroup.Field()
    # delete_group = DeleteGroup.Field()
    add_user_to_group = AddUserToGroup.Field()
    remove_user_from_group = RemoveUserFromGroup.Field()


class UserQueries(object):
    users = graphene.List(UserType)
    user = graphene.Field(UserType, id=graphene.Int())

    def resolve_users(self, info):
        return User.objects.all()

    def resolve_user(self, info, id):
        return User.objects.get(pk=id)


class GroupQueries(object):
    groups = graphene.List(GroupType)
    group = graphene.Field(GroupType, id=graphene.Int())

    def resolve_groups(self, info):
        return Group.objects.all()

    def resolve_group(self, info, id):
        return Group.objects.get(pk=id)


class Query(
    UserQueries,
    GroupQueries,
    graphene.ObjectType
):
    pass


class Mutation(
    UserMutations,
    GroupMutations,
    graphene.ObjectType
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
