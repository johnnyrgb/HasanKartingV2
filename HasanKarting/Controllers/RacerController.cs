using api.Models.Data;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace api.Controllers
{
    

    [Route("api/[controller]")]
    [ApiController]
    public class RacerController : ControllerBase
    {
        private readonly DatabaseContext _databaseContext;
        public RacerController(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }
        // GET: api/<RacerController>


        // GET api/<RacerController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<RacerController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<RacerController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<RacerController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
