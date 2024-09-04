from http import HTTPStatus


def test_create_user(client):
    response = client.post(  # UserSchema
        '/users/',
        json={
            'username': 'testusername',
            'email': 'test@test.com',
         },
    )

    assert response.status_code == HTTPStatus.CREATED
    assert response.json() == {
        'username': 'testusername',
        'email': 'test@test.com',
        'id': 1,
    }


def test_read_users(client):
    response = client.get('/users/')

    assert response.status_code == HTTPStatus.OK
    assert response.json() == {
        'users': [
            {
                'username': 'testusername',
                'email': 'test@test.com',
                'id': 1,
            }
        ]
    }


def test_update_user(client):
    response = client.put(
        '/users/1',
        json={
                'username': 'testusername2',
                'email': 'test@test.com',
                'id': 1,
            }
    )
    assert response.json() == {
        'username': 'testusername2',
        'email': 'test@test.com',
        'id': 1,
    }


def test_update_user_error(client):
    response = client.put('/users/9999',
                          json={
                              'username': 'nonexistent',
                              'email': 'nonexistent@test.com',
                              }
    )
    assert response.json() == {'detail': 'User not found'}


def test_delete_user(client):
    response = client.delete('/users/1')

    assert response.json() == {'message': 'User deleted'}


def test_delete_user_error(client):
    response = client.delete('/users/2')

    assert response.json() == {'detail': 'User not found'}


def test_read_users_with_id(client):
    client.post('/users/',
        json={
            'username': 'user3',
            'email': 'user3@test.com',
        }
    )

    response = client.get('/users/1')

    assert response.status_code == HTTPStatus.OK
    assert response.json() == {
        'id': 1,
        'username': 'user3',
        'email': 'user3@test.com'
    }


def test_read_users_with_id_error(client):
    response = client.get('/users/2')

    assert response.json() == {'detail': 'User not found'}
