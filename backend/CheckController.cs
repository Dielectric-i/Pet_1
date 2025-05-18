using Microsoft.AspNetCore.Mvc;

// Контроллер обеспечивает эндпойнт GET /check
// Возвращает JSON вида { "status": "OK" }, который ждёт фронтенд.
[ApiController]
[Route("check")]
public class CheckController : ControllerBase
{
  [HttpGet]
  public IActionResult Get()
  {
    return Ok(new { status = "OK" });
  }
}