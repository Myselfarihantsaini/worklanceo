export type HiringRole={id:number;name:string;hires:string;salary:string};
export type HiringInputs={roles:HiringRole[];flat:string;rate:string;base:'annual'|'monthly';discount:string;perHire:string;setup:string;tax:string;model:'auto'|'fixed'|'percentage'};
export const roundMoney=(n:number)=>Math.round((n+Number.EPSILON)*100)/100;
export function calculateHiring(input:HiringInputs){
 const number=(v:string)=>v.trim()===''?NaN:Number(v);
 const errors:string[]=[];
 const valid=(v:string,label:string,max:number)=>{const n=number(v);if(!Number.isFinite(n)||n<0||n>max)errors.push(`${label}: enter a number from 0 to ${max.toLocaleString('en-IN')}.`);return n};
 if(!input.roles.length)errors.push('Add at least one role.');
 const rows=input.roles.map((r,i)=>{const hires=number(r.hires),salary=number(r.salary);if(!Number.isInteger(hires)||hires<1||hires>100000)errors.push(`Role ${i+1}: hires must be a whole number from 1 to 100,000.`);if(!Number.isFinite(salary)||salary<=0||salary>10000000)errors.push(`Role ${i+1}: enter a monthly salary above 0 and at most 1,00,00,000.`);return {...r,hires,salary}});
 const flat=valid(input.flat,'Fixed fee',10000000),rate=valid(input.rate,'Percentage fee',100),discount=valid(input.discount,'Discount',100),perHire=valid(input.perHire,'Additional cost per hire',10000000),setup=valid(input.setup,'One-time cost',100000000),tax=valid(input.tax,'Tax estimate',100);
 if(errors.length)return {errors,result:null};
 const hires=rows.reduce((s,r)=>s+r.hires,0),payroll=roundMoney(rows.reduce((s,r)=>s+r.hires*r.salary,0));
 const grossFixed=roundMoney(hires*flat),grossPercentage=roundMoney(rows.reduce((s,r)=>s+r.hires*r.salary*(input.base==='annual'?12:1)*rate/100,0));
 const fixed=roundMoney(grossFixed*(1-discount/100)),percentage=roundMoney(grossPercentage*(1-discount/100));
 const selected=input.model==='auto'?(fixed<=percentage?'fixed':'percentage'):input.model;
 const gross=selected==='fixed'?grossFixed:grossPercentage,agency=selected==='fixed'?fixed:percentage;
 const extras=roundMoney(hires*perHire+setup),subtotal=roundMoney(agency+extras),taxAmount=roundMoney(subtotal*tax/100),total=roundMoney(subtotal+taxAmount);
 return {errors,result:{hires,payroll,grossFixed,grossPercentage,fixed,percentage,selected,gross,discountAmount:roundMoney(gross-agency),agency,extras,subtotal,taxAmount,total,perPerson:roundMoney(total/hires),difference:roundMoney(Math.abs(fixed-percentage)),firstMonth:roundMoney(payroll+total)}};
}
