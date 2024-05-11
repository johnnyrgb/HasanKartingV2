interface raceObject // интерфейс, определяющий структуру объекта для представления информации о гонке
{
    id?: number, 
    date: string, // дата проведения
    isended?: boolean, // завершена ли гонка
    protocols?: [], // протоколы участников гонки
}

export default raceObject;