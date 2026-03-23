var REG_NONE = NewRegistrar("none");
var DSP_CF = NewDnsProvider("cloudflare");

var GH_IPV4 = [
    "185.199.108.153", "185.199.109.153",
    "185.199.110.153", "185.199.111.153"
];

var GH_IPV6 = [
    "2606:50c0:8000::153", "2606:50c0:8001::153",
    "2606:50c0:8002::153", "2606:50c0:8003::153"
];

function GitHubPages(name) {
    return [
        GH_IPV4.map(ip => A(name, ip, CF_PROXY_ON)),
        GH_IPV6.map(ip => AAAA(name, ip, CF_PROXY_ON))
    ];
}

// Main Domain
D("elainxi.events", REG_NONE, DnsProvider(DSP_CF),
    GitHubPages("@"),
    CNAME("www", "elainxi.events.", CF_PROXY_ON)
);

// Alias Domain (Redirects handled via Cloudflare Redirect Rules)
D("elainxi.com", REG_NONE, DnsProvider(DSP_CF),
    CNAME("@", "elainxi.events.", CF_PROXY_ON),
    CNAME("www", "elainxi.events.", CF_PROXY_ON)
);
