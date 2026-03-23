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
        GH_IPV4.map(function(ip) { return A(name, ip, CF_PROXY_ON); }),
        GH_IPV6.map(function(ip) { return AAAA(name, ip, CF_PROXY_ON); })
    ];
}

// email handling using Google Workspace
function GoogleWorkspace(dmarc_email, dkim_key) {
    return [
        // incoming router using Google Workspace
        MX('@', 1, 'ASPMX.L.GOOGLE.COM.', TTL('1h')),
        MX('@', 5, 'ALT1.ASPMX.L.GOOGLE.COM.', TTL('1h')),
        MX('@', 5, 'ALT2.ASPMX.L.GOOGLE.COM.', TTL('1h')),
        MX('@', 10, 'ALT3.ASPMX.L.GOOGLE.COM.', TTL('1h')),
        MX('@', 10, 'ALT4.ASPMX.L.GOOGLE.COM.', TTL('1h')),
        SPF_BUILDER({
            label: '@',
            overflow: "_spf%d",
            overhead1: "20",
            parts: [
                'v=spf1',
                // allow sending using google's SMTP server
                'include:_spf.google.com',
                '~all',
            ],
            flatten: [],
            ttl: '1h'
        }),
        TXT('google._domainkey', dkim_key.join('')),
        DMARC_BUILDER({
            policy: 'quarantine',
            alignmentSPF: 'strict',
            alignmentDKIM: 'strict',
            rua: [
                'mailto:' + dmarc_email,
            ]
        }),
    ];
}

// Main Domain
D("elainxi.events", REG_NONE, DnsProvider(DSP_CF),
    GoogleWorkspace('b5d8494a6656405490be54a0661adcd4@dmarc-reports.cloudflare.net', [
        'v=DKIM1;k=rsa;p=',
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAj8mFkBnW4U9DGJlYvjsm',
        'CAUH6EjdmtwcyJKt6UY910kTsSLt8QdfAqoQWi3qLd523WoB8zHjO0NdH0WrB65o',
        '/7d0ZwbMQWMDo4YYu4IyoAcd5MKDVpHBeqfbhEmZra9ZZBo2n9cveSJzXjXQ7IZK',
        'SXZ0AkohNXWumXIm8zvnZ0XzupLKACytFJns6GvQnSsQ9ca808HxRpMgklED49cM',
        'YVdiZfnrkkAXh5tx2U/wbzlJ6lc8WxEC12yXEe/BR9AcNOvC4FQNSbRUXEe0vQg6',
        'jQTCFeSUEgd24EO0adGT9RE9rA2u3qHWprH4ooqVYNBgKrFH0Y31cLKxaZpvkSDJ',
        'EQIDAQAB'
    ]),
    GitHubPages("@"),
    CNAME("www", "elainxi.events.", CF_PROXY_ON),
    TXT('@', 'google-site-verification=JlIbTjFfxJkjrPQQyWryffWN4exb4mCSHLkH-1QGlrY', TTL(3600))
);

// Alias Domain (Redirects handled via Cloudflare Redirect Rules)
D("elainxi.com", REG_NONE, DnsProvider(DSP_CF),
    GoogleWorkspace('8bfcb299a41745cea1725280cac19533@dmarc-reports.cloudflare.net', [
        'v=DKIM1;k=rsa;p=',
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2NGDRgqYDOJ8+OXx2jr4',
        'qB2r3pZMoTZ1WEGoKF9xet9wbv/zhcyi4l+SVVQfhg/JYQc3HNx9eu4wZD7FTz4Z',
        '81hCWUyzzekqR7v1ES+PfTmIePwh5EZ1wXBOQNBM8lx/dqEiswY57AOq3nPgMIJs',
        'OEzxnxvB2U3dzrOizDJxQVpf0CFTW9FLJdPzcxmvk3MllGwh01lC9nBzX8/CmgCi',
        '461+QeiGKB+aCW187ajNJXZMvXmUf5+458Y6AUH5zc2ueYIrXMxunYx+6yNpfeVA',
        'WZgx9gNxjCRx043FgJou67e6RyjXJdSH5g6lU3VQB2yYApOtf4lH+6WYlYeQm2tV',
        '+wIDAQAB'
    ]),
    GitHubPages("@"),
    CNAME("www", "elainxi.events.", CF_PROXY_ON),
    TXT('@', 'google-site-verification=jwquSdj7zYIHInll45nDC9vaTaTXslG8lJMUMW17aAg', TTL(3600))
);
