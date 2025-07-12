using Microsoft.AspNetCore.Mvc;

namespace PetApi.Controllers;

[ApiController]
[Route("health")]
public class CheckController : ControllerBase
{
  [HttpGet]
  public IActionResult Get()
  {
    return Ok(new { status = "OK" });
  }
}