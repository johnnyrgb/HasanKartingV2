interface racerObject  // интерфейс, определяющий структуру объекта для представления информации о гонщике
{
    id?: number,
    username: string, // имя пользователя
    email: string, // адрес email
    racenumber?: number, // количество проведенных гонок
    winsnumber?: number // количество побед
}

export default racerObject;