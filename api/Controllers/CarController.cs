﻿using api.Models;
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
    public class CarController : ControllerBase
    {

        private readonly DatabaseContext _databaseContext;
        public CarController(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        // GET: api/<CarController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Car>>> Get()
        {
            return await _databaseContext.Cars.ToListAsync();
        }

        // GET api/<CarController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Car>> Get(int id)
        {
            var car = await _databaseContext.Cars.FindAsync(id);
            if (car == null)
                return NotFound();
            return car;
        }

        // POST api/<CarController>
        [HttpPost]
        public async Task<ActionResult<Car>> Post(Car car)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            _databaseContext.Cars.Add(car);
            await _databaseContext.SaveChangesAsync();
            return CreatedAtAction("Get", new { id = car.Id }, car);
        }

        // PUT api/<CarController>/5
        [HttpPut("{id}")]
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
