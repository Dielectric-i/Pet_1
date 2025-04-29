using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

public class CheckController : ControllerBase
{

    [HttpGet("check")]
    public async Task<IActionResult> GetCheckById()
    {
        await Task.Delay(1000); // Simulate some async work
        return Ok(new { message = "Hello from Pet API!" });
    }

}