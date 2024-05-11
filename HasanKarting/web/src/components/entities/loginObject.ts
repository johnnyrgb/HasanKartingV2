interface loginObject // интерфейс, определяющий структуру объекта для данных для аутентификации пользователя
{
    username: string,
    password: string,
    rememberMe: boolean
}

export default loginObject;