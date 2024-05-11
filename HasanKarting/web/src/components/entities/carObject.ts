
interface carObject // интерфейс, определяющий структуру объекта "Болид"
{
    id?: number,
    manufacturer: string, // производитель
    model: string, // модель
    power: number, // мощность
    mileage: number, // пробег
    weight: number // масса
}

export default carObject;