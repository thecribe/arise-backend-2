import{a as e,t}from"./jsx-runtime-D_MnEzuy.js";import{n}from"./createLucideIcon-BJGvH109.js";import{f as r,l as i,s as a}from"./input-C_fBIl7z.js";import{a as o,i as s,r as c,t as l}from"./FormSelect-DnXRN9Ep.js";import{C as u,E as d,F as f,M as p,Ot as m,T as h,V as g,W as _,i as v,st as y,ut as b,w as x,x as S,z as C}from"./index-CiVnOsJK.js";import{t as w}from"./FormInput-DuWgzPzi.js";var T=e(n(),1),E=t();function D({control:e,name:t,label:n,required:r,helperText:i}){let{field:o,fieldState:s}=a({control:e,name:t});return(0,E.jsx)(S,{id:o.name,label:``,required:r,helperText:i,error:s.error?.message,children:(0,E.jsxs)(`div`,{className:`flex items-start gap-3`,children:[(0,E.jsx)(p,{id:o.name,checked:o.value,onCheckedChange:o.onChange}),(0,E.jsxs)(`label`,{htmlFor:o.name,className:`\r
            cursor-pointer\r
            text-sm\r
            leading-relaxed\r
            text-slate-600\r
          `,children:[n,r&&(0,E.jsx)(`span`,{className:`ml-1 text-red-500`,children:`*`})]})]})})}function O(){let[e,t]=(0,T.useState)(!1),n=C(),{jobTypes:a,isLoading:p,isError:S}=v(),O=i({resolver:f(c),defaultValues:{firstName:``,lastName:``,email:``,phoneNumber:``,address:``,postcode:``,jobTypeId:``,acceptTerms:!1}});if(p)return(0,E.jsx)(_,{});if(S)return(0,E.jsx)(`div`,{className:`flex min-h-screen items-center justify-center`,children:(0,E.jsx)(`p`,{className:`text-red-500`,children:`Error loading bootstrap data.`})});let k=e=>{n.mutate(e,{onSuccess:async()=>{t(!0),r.success(`Account created successfully. Please check your email for verification.`)},onError:e=>{let t=e;r.error(t.response?.data.message||`Unable to create account. Please try again.`)}})};if(e)return(0,E.jsx)(h,{className:`w-full max-w-3xl`,children:(0,E.jsx)(d,{className:`p-8 md:p-10`,children:(0,E.jsxs)(`div`,{className:`space-y-8`,children:[(0,E.jsx)(x,{title:`Check your email`,description:`\r
                We have sent a verification link to your email. Please verify your email before logging in.\r
            `}),(0,E.jsxs)(`div`,{className:`text-center flex flex-col gap-5`,children:[(0,E.jsx)(`p`,{children:`Your account has been created. We have sent a verification link to your email. Please verify your email before logging in.`}),(0,E.jsx)(m,{to:g.AUTH.LOGIN,className:`\r
                ml-1\r
                font-semibold\r
                text-blue-600\r
                hover:text-blue-700\r
              `,children:`Continue to Login`})]})]})})});let A=a?.data?.jobTypes.map(({id:e,name:t})=>({label:t,value:e}));return(0,E.jsx)(h,{className:`w-full max-w-3xl`,children:(0,E.jsx)(d,{className:`p-8 md:p-10`,children:(0,E.jsxs)(`div`,{className:`space-y-8`,children:[(0,E.jsx)(x,{title:`Create Account`,description:`\r
              Register to start your Airse healthcare journey.\r
            `}),(0,E.jsxs)(`form`,{onSubmit:O.handleSubmit(k),className:`space-y-5`,children:[(0,E.jsxs)(`div`,{className:`grid gap-6 md:grid-cols-2`,children:[(0,E.jsx)(w,{control:O.control,name:`firstName`,label:`First Name`,placeholder:`John`,required:!0,icon:(0,E.jsx)(s,{className:`h-5 w-5`})}),(0,E.jsx)(w,{control:O.control,name:`lastName`,label:`Last Name`,placeholder:`Smith`,required:!0,icon:(0,E.jsx)(s,{className:`h-5 w-5`})})]}),(0,E.jsx)(w,{control:O.control,name:`email`,label:`Email Address`,placeholder:`john@example.com`,type:`email`,required:!0,icon:(0,E.jsx)(b,{className:`h-5 w-5`})}),(0,E.jsx)(w,{control:O.control,name:`phoneNumber`,label:`Phone Number`,placeholder:`+44...`,required:!0,icon:(0,E.jsx)(y,{className:`h-5 w-5`})}),(0,E.jsx)(w,{control:O.control,name:`address`,label:`Address`,placeholder:`Enter your address`,required:!0,icon:(0,E.jsx)(o,{className:`h-5 w-5`})}),(0,E.jsxs)(`div`,{className:`grid gap-5 md:grid-cols-2`,children:[(0,E.jsx)(w,{control:O.control,name:`postcode`,label:`Postcode`,placeholder:`SW1A 1AA`,required:!0}),(0,E.jsx)(l,{control:O.control,name:`jobTypeId`,label:`Job Type`,placeholder:`Select job type`,options:A,required:!0})]}),(0,E.jsx)(D,{control:O.control,name:`acceptTerms`,label:`\r
                I agree to the terms and conditions\r
              `,required:!0}),(0,E.jsx)(u,{type:`submit`,loading:n.isPending,loadingText:`Creating account...`,children:`Register`})]}),(0,E.jsxs)(`div`,{className:`\r
            text-center\r
            text-sm\r
            text-slate-500\r
          `,children:[`Already have an account?`,(0,E.jsx)(m,{to:g.AUTH.LOGIN,className:`\r
                ml-1\r
                font-semibold\r
                text-blue-600\r
                hover:text-blue-700\r
              `,children:`Sign In`})]})]})})})}export{O as default};