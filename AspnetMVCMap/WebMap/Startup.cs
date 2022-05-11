using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(WebMap.Startup))]
namespace WebMap
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
