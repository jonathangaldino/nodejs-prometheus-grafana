# Nodejs + Prometheus + Grafana

> Este repositório é o resultado de um estudo que fiz em busca de entender como monitorar uma aplicação em Nodejs (express) com prometheus

# Sumário

- [Iniciar a aplicação](#Iniciar-a-aplicação)
- [Setup](#setup)
  - [API Express](#API-em-Express)
  - [Build da Imagem da aplicação](#Build-da-Imagem-da-aplicação)
  - [Configurando o Prometheus](#Configurando-o-Prometheus)
  - [Configurando o Grafana](#Configurando-o-Grafana)
  - [Subindo os conteiners](#Subindo-os-conteiners)
- [Author](#Author)
- [License](#License)

# Iniciar a aplicação

- Buildar a imagem da aplicação usando Docker

```bash
$ cd app/
$ docker build -t "laboratory/tag" ./
```

2. Subir os conteiners via docker-compose

```bash
$ docker-compose up -d
```

Pronto. Acesso os serviços via:

- Prometheus - http://localhost:9090/
- Grafana - http://localhost:3000/
- API - http://localhost:5000/
- Métricas - http://localhost:5000/metrics

Endpoints:

- /api
- /slow
- /error
- /metrics

# Setup

## API em Express

Usando a [express-prom-bundle](https://www.npmjs.com/package/express-prom-bundle) foi possível exportar algumas métricas da aplicação e do nodejs em si.

Por default, as métricas são exportadas em um endpoint `/metrics`. Há uma forma para configurar essa biblioteca, onde é possível até passar uma configuração pro prom-client (biblioteca 'padrão' de exportação de métricas para Nodejs).

Utilizei uma configuração para incluir o método e o caminho nas métricas, assim como pedi pro `prom-client` para exportar as métricas do Nodejs (essas estão comentadas)

```js
promBundle({
  includeMethod: true,
  includePath: true,
  promClient: {
    // collectDefaultMetrics: {
    //   timeout: 1000
    // }
  }
});
```

## Build da Imagem da aplicação

Criei uma imagem utilizando o docker. O dockerfile está simples e comentado. Mas os steps são:

1. Seleciona o node na vestão 12.16.1
2. Cria um diretório de trabalho chamado `/laboratory/app`
3. Instala o Yarn
4. Copia o package.json para a pasta de trabalho
5. Copia o yarn.lock para a pasta de trabalho
6. Instala as dependências da aplicação
7. Expõe a porta 5000 (porta da aplicação, vide app.js)
8. Executo o script `start` do projeto, dando start na aplicação

Para buildar a imagem (vá para a pasta /app antes):

```bash
$ docker build -t "laboratory/app" ./
```

## Configurando o Prometheus

A configuração do penas informei um `scrape_config`, informando ao Prometheus realizar um scrape no target informado, obtendo as métricas, a cada 10 segundos.

```bash
  scrape_configs:
  - job_name: "nodejsApp"
    scrape_interval: 10s
    static_configs:
      - targets: ["nodejs:5000"]
```

Observação, `nodejs:5000` é o serviço que eu dei UP via docker-compose (mais info abaixo).

## Configurando o Grafana

Tecnicamente não fiz nenhuma configuração ao Grafana em si. Criei e deixei fixo o Prometheus como um [datasource](./grafana/provisioning/datasources/datasource.yml). Dessa forma, agiliza o processo de setup de um datasource dentro do grafana.

```yml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    orgId: 1
    url: http://prometheus:9090
    basicAuth: false
    isDefault: true
    editable: true
```

## Subindo os conteiners

Via docker-compose, orquestrei os serviços de forma que eles estejam na mesma rede (mesmo que em um caso real não funcionará assim muita das vezes).

Para subir os serviços, basta rodar: `$ docker-compose up -d`

_OBS: O compose precisa da imagem da aplicação criada visto que a mesma é citada na linha 48 do docker-compose: `image: laboratory/app`_

# Author

[Jonathan Galdino](https://github.com/jonathangaldino)

# License

MIT
