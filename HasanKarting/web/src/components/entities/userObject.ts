interface userObject { // интерфейс, определяющий структуру объекта для представления информации о пользователе
    username: string, // имя пользователя 
    email: string, // адрес email
    roles: string[], // массив ролей пользователя
    isAuthenticated: boolean, // аутентифицирован ли пользователь
}

export default userObject;