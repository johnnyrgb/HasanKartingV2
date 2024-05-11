using api.Models;
using api.Models.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace api.Controllers
{
    [Route("api/[controller]")]
    [EnableCors]
    [ApiController]
    public class CarController : ControllerBase
    {

        private readonly DatabaseContext _databaseContext;
        public CarController(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }
        /// <summary>
        /// Получение списка всех болидов
        /// </summary>
        // GET: api/<CarController>
        [HttpGet]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<IEnumerable<Car>>> Get()
        {
            return await _databaseContext.Cars.ToListAsync();
        }
        /// <summary>
        /// Получение болида по id
        /// </summary>
        // GET api/<CarController>/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Car>> Get(int id)
        {
            var car = await _databaseContext.Cars.FindAsync(id);
            if (car == null)
                return NotFound();
            return car;
        }
        /// <summary>
        /// Создание нового болида
        /// </summary>
        // POST api/<CarController>
        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Car>> Post(Car car)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            _databaseContext.Cars.Add(car);
            await _databaseContext.SaveChangesAsync();
            return CreatedAtAction("Get", new { id = car.Id }, car);
        }
        /// <summary>
        /// Обновление существующего болида
        /// </summary>
        // PUT api/<CarController>/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Put(int id, Car car)
        {
            if (id != car.Id)
                return BadRequest();
            _databaseContext.Entry(car).State = EntityState.Modified;

            try
            {
                await _databaseContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!isExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }
        /// <summary>
        /// Удаление существующего болида
        /// </summary>
        // DELETE api/<CarController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var car = await _databaseContext.Cars.FindAsync(id);
            if (car == null)
                return NotFound();
            _databaseContext.Cars.Remove(car);
            await _databaseContext.SaveChangesAsync();
            return NoContent();
        }
        private bool isExists(int id)
        {
            return _databaseContext.Cars.Any(e => e.Id == id);
        }
    }
}
