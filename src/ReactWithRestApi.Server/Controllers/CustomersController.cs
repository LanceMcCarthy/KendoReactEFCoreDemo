using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNetCore.Mvc;
using ReactWithRestApi.Server.Models;

namespace ReactWithRestApi.Server.Controllers;

// IMPORTANT: To recreate what I did here for your SQL server's context follow this tutorial https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-9.0&tabs=visual-studio
// That shows you how to make the connection to the SQL server using EntityFramework Core.
//
// Once that is working, now you can focus on the Kendo topics. Everything until now was generic .NET programming.
// the modifications you do are to change the signature of the methods to:
// A - accept the Kendo Grid's DataSourceRequest
// B - return the Kendo Grid's DataSourceResult
// This is what I have done below.

[ApiController]
[Route("api/[controller]")]
public class CustomersController(LanceDbContext dbContext) : ControllerBase
{
    // GET: api/customers
    [HttpGet]
    public async Task<JsonResult> GetCustomers([DataSourceRequest] DataSourceRequest request)
    {
        // The special trick is that you can take advantage of the Telerik UI for ASP.NET Core's DataSourceRequest and DataSourceResult
        // it internally knows how to handle the sorting, paging and other important things that are needed to communicate the right dat aback to the front end.
        var result = await dbContext.Customers.ToDataSourceResultAsync(request);
        return new JsonResult(result);
    }

    // POST: api/customers
    [HttpPost]
    public async Task<JsonResult> AddCustomer([DataSourceRequest] DataSourceRequest request, CustomerEntity customer)
    {
        dbContext.Customers.Add(customer);
        
        var result = await dbContext.Customers.ToDataSourceResultAsync(request);
        return new JsonResult(result);
    }

    // PUT: api/customers
    [HttpPut]
    public async Task<JsonResult> UpdateCustomer([DataSourceRequest] DataSourceRequest request, CustomerEntity customer)
    {
        dbContext.Customers.Update(customer);

        var result = await dbContext.Customers.ToDataSourceResultAsync(request);
        return new JsonResult(result);
    }

    // DELETE: api/customers
    [HttpDelete]
    public async Task<JsonResult> DeleteCustomer([DataSourceRequest] DataSourceRequest request, CustomerEntity customer)
    {
        dbContext.Customers.Remove(customer);
        
        var result = await dbContext.Customers.ToDataSourceResultAsync(request);
        return new JsonResult(result);
    }
}