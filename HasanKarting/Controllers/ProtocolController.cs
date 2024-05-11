using api.Models;
using api.Models.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace api.Controllers
{
    [Route("api/[controller]")]
    [EnableCors]
    [ApiController]
    public class ProtocolController : ControllerBase
    {

        private readonly DatabaseContext _databaseContext;
        private readonly UserManager<IdentityUser<int>> _userManager;
        public ProtocolController(DatabaseContext databaseContext, UserManager<IdentityUser<int>> userManager)
        {
            _databaseContext = databaseContext;
            _userManager = userManager;
        }
        /// <summary>
        /// Получение списка всех протоколов
        /// </summary>
        // GET: api/<ProtocolController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Protocol>>> Get()
        {
            return await _databaseContext.Protocols.ToListAsync();
        }
        /// <summary>
        /// Получение протокола гонки по id
        /// </summary>
        // GET api/<ProtocolController>/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Protocol>> Get(int id)
        {
            var protocol = await _databaseContext.Protocols.FindAsync(id);
            if (protocol == null)
                return NotFound();
            return protocol;
        }


        /// <summary>
        /// Метод принимает id гонки. Возвращает список протоколов, которые относятся к этой гонке 
        /// (таблица результатов вида: гонщик, болид, время прохождения дистанции).
        /// </summary>
        [HttpGet("race/{id}")]
        [Authorize(Roles = "Administrator, Racer")]
        public async Task<ActionResult> GetByRaceId(int id)
        {
            var protocols = (await _databaseContext.Protocols.ToListAsync()).Where(p => p.RaceId == id).Select(async p => new
            {
                racer = (await _userManager.FindByIdAsync((p.UserId).ToString())).UserName,
                car = (await _databaseContext.Cars.FindAsync(p.CarId)).Manufacturer + " " + (await _databaseContext.Cars.FindAsync(p.CarId)).Model,
                completiontime = p.CompletionTime
            });

            return Ok(protocols);

        }
        /// <summary>
        /// Метод добавления нового протокола
        /// </summary>
        // POST api/<ProtocolController>
        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Protocol>> Post(Protocol protocol)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            _databaseContext.Protocols.Add(protocol);
            await _databaseContext.SaveChangesAsync();
            return CreatedAtAction("Get", new { id = protocol.Id }, protocol);
        }
        /// <summary>
        /// Метод обновления протокола
        /// </summary>
        // PUT api/<ProtocolController>/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Put(int id, Protocol protocol)
        {
            if (id != protocol.Id)
                return BadRequest();
            _databaseContext.Entry(protocol).State = EntityState.Modified;

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
        /// Метод удаления протокола
        /// </summary>
        // DELETE api/<ProtocolController>/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Delete(int id)
        {
            var protocol = await _databaseContext.Protocols.FindAsync(id);
            if (protocol == null)
                return NotFound();
            _databaseContext.Protocols.Remove(protocol);
            await _databaseContext.SaveChangesAsync();
            return NoContent();
        }
        private bool isExists(int id)
        {
            return _databaseContext.Protocols.Any(e => e.Id == id);
        }
    }
}
