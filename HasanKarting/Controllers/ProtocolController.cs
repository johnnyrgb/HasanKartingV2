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
    public class ProtocolController : ControllerBase
    {

        private readonly DatabaseContext _databaseContext;
        public ProtocolController(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        // GET: api/<ProtocolController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Protocol>>> Get()
        {
            return await _databaseContext.Protocols.ToListAsync();
        }

        // GET api/<ProtocolController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Protocol>> Get(int id)
        {
            var protocol = await _databaseContext.Protocols.FindAsync(id);
            if (protocol == null)
                return NotFound();
            return protocol;
        }

        // POST api/<ProtocolController>
        [HttpPost]
        public async Task<ActionResult<Protocol>> Post(Protocol protocol)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            _databaseContext.Protocols.Add(protocol);
            await _databaseContext.SaveChangesAsync();
            return CreatedAtAction("Get", new { id = protocol.Id }, protocol);
        }

        // PUT api/<ProtocolController>/5
        [HttpPut("{id}")]
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

        // DELETE api/<ProtocolController>/5
        [HttpDelete("{id}")]
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
