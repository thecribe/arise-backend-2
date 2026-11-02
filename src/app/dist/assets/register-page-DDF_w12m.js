import{a as e,t}from"./jsx-runtime-D_MnEzuy.js";import{n,t as r}from"./createLucideIcon-BJGvH109.js";import{c as i,d as a,o}from"./index.esm-DChJxQ-z.js";import{a as s,i as c,n as l,r as u,t as d}from"./select-BDFVMmxM.js";import{A as f,B as p,E as m,F as h,H as g,I as _,M as v,N as y,O as b,P as x,Tt as S,U as C,i as w,it as T,j as E,st as D,y as O}from"./index-ROCSi0CX.js";import{t as k}from"./FormInput-Dp_9f4K-.js";var A=r(`house`,[[`path`,{d:`M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8`,key:`5wwlr5`}],[`path`,{d:`M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z`,key:`r6nss1`}]]),j=r(`user`,[[`path`,{d:`M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2`,key:`975kel`}],[`circle`,{cx:`12`,cy:`7`,r:`4`,key:`17ys0d`}]]),M=f({firstName:E().min(2,`First name must be at least 2 characters`),lastName:E().min(2,`Last name must be at least 2 characters`),email:E().email(`Please enter a valid email address`),phoneNumber:E().min(10,`Please enter a valid phone number`),address:E().min(5,`Address is required`),postcode:E().min(3,`Postcode is required`),jobTypeId:E().min(1,`Please select a job type`),acceptTerms:b().refine(e=>e===!0,{message:`You must accept the terms and conditions`})}),N=e(n(),1),P=t();function F({control:e,name:t,label:n,placeholder:r,options:i,required:a,helperText:f,disabled:p}){let{field:h,fieldState:g}=o({control:e,name:t}),_=i.find(e=>e.value===h.value);return(0,P.jsx)(m,{id:h.name,label:n,required:a,helperText:f,error:g.error?.message,children:(0,P.jsxs)(d,{value:h.value,onValueChange:h.onChange,disabled:p,children:[(0,P.jsx)(c,{id:h.name,className:`\r
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
          `,children:(0,P.jsx)(s,{children:_?.label??r})}),(0,P.jsx)(l,{children:i.map(e=>(0,P.jsx)(u,{value:e.value,children:e.label},e.value))})]})})}function I({control:e,name:t,label:n,required:r,helperText:i}){let{field:a,fieldState:s}=o({control:e,name:t});return(0,P.jsx)(m,{id:a.name,label:``,required:r,helperText:i,error:s.error?.message,children:(0,P.jsxs)(`div`,{className:`flex items-start gap-3`,children:[(0,P.jsx)(O,{id:a.name,checked:a.value,onCheckedChange:a.onChange}),(0,P.jsxs)(`label`,{htmlFor:a.name,className:`\r
            cursor-pointer\r
            text-sm\r
            leading-relaxed\r
            text-slate-600\r
          `,children:[n,r&&(0,P.jsx)(`span`,{className:`ml-1 text-red-500`,children:`*`})]})]})})}function L(){let[e,t]=(0,N.useState)(!1),n=p(),{jobTypes:r,isLoading:o,isError:s}=w();console.log(r);let c=i({resolver:y(M),defaultValues:{firstName:``,lastName:``,email:``,phoneNumber:``,address:``,postcode:``,jobTypeId:``,acceptTerms:!1}});if(o)return(0,P.jsx)(C,{});if(s)return(0,P.jsx)(`div`,{className:`flex min-h-screen items-center justify-center`,children:(0,P.jsx)(`p`,{className:`text-red-500`,children:`Error loading bootstrap data.`})});let l=e=>{n.mutate(e,{onSuccess:async()=>{t(!0),a.success(`Account created successfully. Please check your email for verification.`)},onError:e=>{let t=e;a.error(t.response?.data.message||`Unable to create account. Please try again.`)}})};if(e)return(0,P.jsx)(h,{className:`w-full max-w-3xl`,children:(0,P.jsx)(_,{className:`p-8 md:p-10`,children:(0,P.jsxs)(`div`,{className:`space-y-8`,children:[(0,P.jsx)(x,{title:`Check your email`,description:`\r
                We have sent a verification link to your email. Please verify your email before logging in.\r
            `}),(0,P.jsxs)(`div`,{className:`text-center flex flex-col gap-5`,children:[(0,P.jsx)(`p`,{children:`Your account has been created. We have sent a verification link to your email. Please verify your email before logging in.`}),(0,P.jsx)(S,{to:g.AUTH.LOGIN,className:`\r
                ml-1\r
                font-semibold\r
                text-blue-600\r
                hover:text-blue-700\r
              `,children:`Continue to Login`})]})]})})});let u=r?.data?.jobTypes.map(({id:e,name:t})=>({label:t,value:e}));return(0,P.jsx)(h,{className:`w-full max-w-3xl`,children:(0,P.jsx)(_,{className:`p-8 md:p-10`,children:(0,P.jsxs)(`div`,{className:`space-y-8`,children:[(0,P.jsx)(x,{title:`Create Account`,description:`\r
              Register to start your Airse healthcare journey.\r
            `}),(0,P.jsxs)(`form`,{onSubmit:c.handleSubmit(l),className:`space-y-5`,children:[(0,P.jsxs)(`div`,{className:`grid gap-6 md:grid-cols-2`,children:[(0,P.jsx)(k,{control:c.control,name:`firstName`,label:`First Name`,placeholder:`John`,required:!0,icon:(0,P.jsx)(j,{className:`h-5 w-5`})}),(0,P.jsx)(k,{control:c.control,name:`lastName`,label:`Last Name`,placeholder:`Smith`,required:!0,icon:(0,P.jsx)(j,{className:`h-5 w-5`})})]}),(0,P.jsx)(k,{control:c.control,name:`email`,label:`Email Address`,placeholder:`john@example.com`,type:`email`,required:!0,icon:(0,P.jsx)(D,{className:`h-5 w-5`})}),(0,P.jsx)(k,{control:c.control,name:`phoneNumber`,label:`Phone Number`,placeholder:`+44...`,required:!0,icon:(0,P.jsx)(T,{className:`h-5 w-5`})}),(0,P.jsx)(k,{control:c.control,name:`address`,label:`Address`,placeholder:`Enter your address`,required:!0,icon:(0,P.jsx)(A,{className:`h-5 w-5`})}),(0,P.jsxs)(`div`,{className:`grid gap-5 md:grid-cols-2`,children:[(0,P.jsx)(k,{control:c.control,name:`postcode`,label:`Postcode`,placeholder:`SW1A 1AA`,required:!0}),(0,P.jsx)(F,{control:c.control,name:`jobTypeId`,label:`Job Type`,placeholder:`Select job type`,options:u,required:!0})]}),(0,P.jsx)(I,{control:c.control,name:`acceptTerms`,label:`\r
                I agree to the terms and conditions\r
              `,required:!0}),(0,P.jsx)(v,{type:`submit`,loading:n.isPending,loadingText:`Creating account...`,children:`Register`})]}),(0,P.jsxs)(`div`,{className:`\r
            text-center\r
            text-sm\r
            text-slate-500\r
          `,children:[`Already have an account?`,(0,P.jsx)(S,{to:g.AUTH.LOGIN,className:`\r
                ml-1\r
                font-semibold\r
                text-blue-600\r
                hover:text-blue-700\r
              `,children:`Sign In`})]})]})})})}export{L as default};