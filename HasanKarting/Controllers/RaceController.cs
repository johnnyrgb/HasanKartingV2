using api.Models;
using api.Models.Data;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace api.Controllers
{
    [Route("api/[controller]")]
    [EnableCors]
    [ApiController]
    public class RaceController : ControllerBase
    {

        private readonly DatabaseContext _databaseContext;
        public RaceController(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        // GET: api/<RaceController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Race>>> Get()
        {
            return await _databaseContext.Races.ToListAsync();
        }

        [HttpGet]
        [Route("all")]
        public async Task<ActionResult> GetAllRaces()
        {
            var races = (await _databaseContext.Races.ToListAsync()).Select(r => new
            {
                id = r.Id,
                date = r.Date,
                racersnumber = _databaseContext.Protocols.Where(p => p.RaceId == r.Id).Count(),
                isended = r.Date > DateTime.Now ? false : true,
                protocols = _databaseContext.Protocols.Where(p => p.RaceId == r.Id),
            });
            return Ok(races);
        }

        // GET api/<RaceController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Race>> Get(int id)
        {
            var race = await _databaseContext.Races.FindAsync(id);
            if (race == null)
                return NotFound();
            return race;
        }

        // GET api/<RaceController>/5
        [HttpGet("generate/{id}")]
        public async Task<ActionResult<Race>> GenerateResultById(int id)
            {
            var protocols = await _databaseContext.Protocols
                .Where(p => p.RaceId == id)
                .ToListAsync();

            if (protocols == null || protocols.Count == 0)
                return NotFound();

            // Генерируем лучшее время в диапазоне от 45 до 55 минут
            var bestTime = TimeOnly.FromTimeSpan(TimeSpan.FromMinutes(new Random().Next(45, 56)));

            foreach (var protocol in protocols)
            {
                // Генерируем случайное время прохождения дистанции, которое хуже лучшего времени, но не более чем на 60 секунд
                var randomTime = TimeOnly.FromTimeSpan(bestTime.ToTimeSpan().Add(TimeSpan.FromSeconds(new Random().Next(0, 61))));

                // Обновляем поле CompletionTime для каждого protocol
                protocol.CompletionTime = randomTime;
            }

            // Сохраняем изменения в базе данных
            await _databaseContext.SaveChangesAsync();

            // Возвращаем результат или другую информацию, если это необходимо
            // Например, можно вернуть информацию о гонке
            return Ok();
        }

        // POST api/<RaceController>
        [HttpPost]
        public async Task<ActionResult<Race>> Post(Race race)
            {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            _databaseContext.Races.Add(race);
            await _databaseContext.SaveChangesAsync();
            return CreatedAtAction("Get", new { id = race.Id }, race);
        }

        // PUT api/<RaceController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Race race)
        {
            if (id != race.Id)
                return BadRequest();
            _databaseContext.Entry(race).State = EntityState.Modified;

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

        // DELETE api/<RaceController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var race = await _databaseContext.Races.FindAsync(id);
            if (race == null)
                return NotFound();
            _databaseContext.Races.Remove(race);
            await _databaseContext.SaveChangesAsync();
            return NoContent();
        }
        private bool isExists(int id)
        {
            return _databaseContext.Races.Any(e => e.Id == id);
        }
    }
}
