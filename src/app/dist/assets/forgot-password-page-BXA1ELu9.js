import{a as e,t}from"./jsx-runtime-D_MnEzuy.js";import{n}from"./createLucideIcon-BJGvH109.js";import{c as r,d as i}from"./index.esm-DChJxQ-z.js";import{A as a,Ct as o,F as s,H as c,I as l,M as u,N as d,P as f,R as p,Tt as m,j as h,st as g}from"./index-ROCSi0CX.js";import{t as _}from"./FormInput-Dp_9f4K-.js";var v=a({email:h().email(`Enter a valid email`)}),y=e(n(),1),b=t();function x(){let[e,t]=(0,y.useState)(!1),n=p(),a=r({resolver:d(v),defaultValues:{email:``}});return e?(0,b.jsx)(s,{className:`w-full max-w-3xl`,children:(0,b.jsx)(l,{className:`p-8 md:p-10`,children:(0,b.jsxs)(`div`,{className:`space-y-8 text-center`,children:[(0,b.jsx)(f,{title:`Check your email`,description:`\r
                      If an account exists with this email, a password reset link has been sent.`}),(0,b.jsx)(m,{to:c.ROOT,className:`\r
                ml-1\r
                font-semibold\r
                text-blue-600\r
                hover:text-blue-700\r
              `,children:`Continue to Home`})]})})}):(0,b.jsx)(s,{className:`w-full max-w-lg`,children:(0,b.jsx)(l,{className:`p-8 md:p-12`,children:(0,b.jsxs)(`div`,{className:`space-y-8`,children:[(0,b.jsx)(f,{title:`Forgot Password?`,description:`\r
              Enter your email and we will send you\r
              instructions to reset your password.\r
            `}),(0,b.jsxs)(`form`,{onSubmit:a.handleSubmit(async e=>{n.mutate(e.email,{onSuccess:()=>{t(!0),i.success(`If an account exists with this email, a password reset link has been sent.`)},onError:e=>{console.error(e);let t=e;i.error(t.response?.data.message||`Unable to create account. Please try again.`)}})}),className:`space-y-6`,children:[(0,b.jsx)(_,{control:a.control,name:`email`,label:`Email Address`,placeholder:`Enter your email address`,type:`email`,required:!0,icon:(0,b.jsx)(g,{className:`h-5 w-5`})}),(0,b.jsx)(u,{type:`submit`,loading:n.isPending,loadingText:`Sending email...`,children:`Send reset link`})]}),(0,b.jsxs)(m,{to:c.AUTH.LOGIN,className:`\r
              flex\r
              items-center\r
              justify-center\r
              gap-2\r
              text-sm\r
              font-medium\r
              text-blue-600\r
              hover:text-blue-700\r
            `,children:[(0,b.jsx)(o,{className:`h-4 w-4`}),`Back to Sign In`]})]})})})}export{x as default};