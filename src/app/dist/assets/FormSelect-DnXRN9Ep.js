import{t as e}from"./jsx-runtime-D_MnEzuy.js";import{t}from"./createLucideIcon-BJGvH109.js";import{s as n}from"./input-C_fBIl7z.js";import{a as r,i,n as a,r as o,t as s}from"./select-CxAkUkqQ.js";import{A as c,D as l,k as u,x as d}from"./index-CiVnOsJK.js";var f=t(`house`,[[`path`,{d:`M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8`,key:`5wwlr5`}],[`path`,{d:`M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z`,key:`r6nss1`}]]),p=t(`user`,[[`path`,{d:`M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2`,key:`975kel`}],[`circle`,{cx:`12`,cy:`7`,r:`4`,key:`17ys0d`}]]),m=u({firstName:c().min(2,`First name must be at least 2 characters`),lastName:c().min(2,`Last name must be at least 2 characters`),email:c().email(`Please enter a valid email address`),phoneNumber:c().min(10,`Please enter a valid phone number`),address:c().min(5,`Address is required`),postcode:c().min(3,`Postcode is required`),jobTypeId:c().min(1,`Please select a job type`)}),h=m.extend({acceptTerms:l().refine(e=>e===!0,{message:`You must accept the terms and conditions`})}),g=e();function _({control:e,name:t,label:c,placeholder:l,options:u,required:f,helperText:p,disabled:m}){let{field:h,fieldState:_}=n({control:e,name:t}),v=u.find(e=>e.value===h.value);return(0,g.jsx)(d,{id:h.name,label:c,required:f,helperText:p,error:_.error?.message,children:(0,g.jsxs)(s,{value:h.value,onValueChange:h.onChange,disabled:m,children:[(0,g.jsx)(i,{id:h.name,className:`\r
            h-12\r
            w-full\r
            \r
            rounded-2xl\r
            border-slate-200/80\r
            bg-white/80\r
            backdrop-blur-xl\r
            shadow-sm\r
            transition-all\r
            hover:border-blue-300\r
            focus:ring-4\r
            focus:ring-blue-500/15        \r
          `,children:(0,g.jsx)(r,{children:v?.label??l})}),(0,g.jsx)(a,{className:`z-[110]`,children:u.map(e=>(0,g.jsx)(o,{value:e.value,children:e.label},e.value))})]})})}export{f as a,p as i,m as n,h as r,_ as t};