*The proposal in one sentence*

## Balancer LPs rewards analytics.

## What?
The full analytics platform will consist of:
1. Review of current rewards calculation scripts with proposed optimisations
Abstract data providers enabling different (faster) data sources like pre-fetched data, batch transactions, Graph or BigQuery caching
2. Prepare a mock data set to enable testing of the rewards scripts
3. Prepare micro-service architecture to synchronise data continuously and offer real-time rewards calculations
4. Implement decentralised backups of calculated rewards, so they are securely persisted for future analytics, research or disputes process
5. Design and implement the rewards explorer UI to offer users a way to browse, visualise and analyze their rewards
6. Offer accurate predictions of the expected APY of user funds across all the pools based on most recent data and trends
7. Rewards simulator - ability to execute a dry-run of rewards update proposals to see how it affects the BAL distribution
8. Rewards api - a service providing estimates of the real-time rewards estimate, so other protocols could display user rewards on their website


## Why?
*What problem it solves*

1. **Improve the efficiency & transparency of the rewards mining process**

Balancer spends every week approximately $3,000,000 rewarding users
for providing liquidity to the protocol. It is a very serious commitment that affects all the protocol’s stakeholders. Therefore, it could be very beneficial to increase the level of community oversight of the process, encouraging more developers to run the scripts, experiment with the data and verify the scripts results which are run by the Balancer team. 

When I first ran the code it took me 6 hours to process a single snapshot on my laptop and I needed to resolve multiple technical issues to an archive node efficiently. It could discourage not only non-technical users but also for seasoned developers to follow this procedure.
Based on my initial attempts on refactoring the code it is possible to improve the efficiency of data fetching.. This could attract more people to interact with the scripts directly, increase the chances of early discovering error and encourage further innovation and process improvements. 

2. **Offer users better tools to track their rewards**

Users need to wait for one-week to see their mining rewards. Although, there are some tools offering rewards rates predictions they do not take into account the history of pools and users balances, offering just a rough estimate based on a single point in time. The tool under development will give a real-time view over accumulated funds, with a split per pool and rich data about return rates. 

Instant feedback and accurate metrics may attract a group of liquidity providers who constantly look for the best market rates (aka yield farmers) by offering them a similar experience to other protocols. 


3. **Enable the community to make informed decisions about rewards structure**

The structure of mining rewards is the most widely discussed topic in the Balancer discord and updates of the rewards parameters are the most popular proposal for the government. However, there are a lot of unchecked assumptions and subjective opinions that could harm the decision process. 
The project aims to build a tool that will simulate the results of a proposal showing how it could affect the rewards. All the users will precisely see how each proposal will change their individual benefits and global distribution. 

4. **Provide tools for other protocols to integrate the rewards mechanism**

Balancer is a popular choice for other protocols to reward providing liquidity for their tokens like UMA or mStable. However, the weekly rewards distribution period makes real-time bonus reporting hard and requires additional efforts to integrate with internal incentivisation schemes. 

This project plans to build a public API so integrators could easily query the current rewards and display them on their dashboards. This could encourage new protocol to Balancer as a partner and increase the deposited funds. 

5. **Prepare an infrastructure for other data-analytics solutions**

Apart from delivering useful tools, this project has got a very strong R&D component focused on data processing and analytics. We will explore different paths to identify the most efficient data extraction and caching tools and patterns of organising the information. 

Other grants and projects building analytics solutions for the Balancer protocol could use the research on data architecture and the deployed infrastructure. Having advanced analytics solutions could encourage professional traders and liquidity providers to use the protocol and create a competitive advantage over other exchanges.  


## When?
The exact time depends on the number and scope of updates to the current rewards system as the current model is open to changes by governance proposals. 
Therefore, I’m estimating the duration as a range, it should take 3-5 months in total.

I estimate the costs at ~$40k.

## Where?

The project will be open source under MIT license and will be publicly available at this address on the release: https://github.com/jakub-wojciechowski/bal-rewards-analytics

## What have been built so far?
There is a prototype of the tool available at https://limestone.finance/#/balancer-rewards

It shows the rewards from the last 3 weeks. However, it needs to be updated to reflect the recent changes in the whitelisted tokens format. 

The code is fully open source: https://github.com/jakub-wojciechowski/limestone 

## Who?
*Team members and their roles in the project and backgrounds*

**Jakub Wojciechowski**

**Role:** lead developer, data-architecture, ETL implementation

**GitHub:** https://github.com/jakub-wojciechowski

**Background:** 
I am a computer science graduate of the Warsaw University living now in London. I've worked as a software engineer in the fintech and insurance industry and progressed his career to a team lead role. I've joined the blockchain space co-founding Alice, where he designed and deployed custodian stable currency (first to go through a regulatory sandbox in UK), in-house transactions relayer and a decentralised impact investment protocol. I've presented at multiple conferences including Devcon and launched Warsaw Smart Contract Coding Club (over 100 members).  I've also worked as a smart-contract auditor at Zeppelin Solutions.

Some of my blockchain projects:

- Transparent donations platform, used by Greater London Authority and presented during Devcon3 ([code](https://github.com/alice-si/alice-v1-monorepo) & [application](https://donationsapp.alice.si/)) presented during Devcon 3

- Fixed-rate lending protocol, winner of EthLondon 2020 ([code](https://github.com/BlazarDeFi/blazar) & [application](https://blazar.now.sh/))

- Impact investing protocol with pure web3 UX ([code](https://github.com/alice-si/alice-v2-monorepo) & [application](https://ida.alice.si/)) presented during EthCC 2020 Paris 

- Multi-agent simulation of Token Curated Registries ([code](https://github.com/alice-si/TcrSimulation.jl) & [report](https://github.com/alice-si/TcrSimulation.jl/blob/master/README.md)) presented during EthCC 2019 Paris 

- Binding library for Gnosis Conditional Tokens ([code](https://github.com/alice-si/gnosis-hg-js) & [workshop](https://github.com/alice-si/gnosis-hg-js/tree/master/dappcon)) presented during Dappcon 2019

- Open source blockchain explorer ([code](https://github.com/alice-si/etheroscope) & [application](https://etheroscope.alice.si/))

- Decentralised IoT oracle protocol ([code](https://github.com/alice-si/sensor-trx) & [demo](https://www.youtube.com/watch?v=Ap6WQRe0XdA))

- Example of one of the code audits - done for Universal Login ([report](https://github.com/UniLogin/UniLogin/blob/master/universal-login-contracts/audits/audit-jwojciechowski.pdf))



**Alex Suvorau**

**Role:** full-stack developer

**GitHub:** https://github.com/alexAlice

**Background:** Alex is a very talented developer with more than 2 years of experience in the blockchain space. We worked on a few projects before and won multiple hackathon’s bounties together. 
