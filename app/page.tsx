import Site from './site';
const organization = {'@context':'https://schema.org','@type':'EmploymentAgency',name:'WorkLanceo',url:'https://worklanceo.com',logo:'https://worklanceo.com/worklanceo-logo.png',description:'Recruitment and workforce hiring across all sectors in India.',areaServed:'India'};
export default function Home(){return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organization)}}/><Site page="home"/></>}
