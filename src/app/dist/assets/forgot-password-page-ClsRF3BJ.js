import{a as e,t}from"./jsx-runtime-D_MnEzuy.js";import{n}from"./createLucideIcon-BJGvH109.js";import{f as r,l as i}from"./input-C_fBIl7z.js";import{A as a,C as o,E as s,Et as c,F as l,L as u,Ot as d,T as f,V as p,k as m,ut as h,w as g}from"./index-CiVnOsJK.js";import{t as _}from"./FormInput-DuWgzPzi.js";var v=m({email:a().email(`Enter a valid email`)}),y=e(n(),1),b=t();function x(){let[e,t]=(0,y.useState)(!1),n=u(),a=i({resolver:l(v),defaultValues:{email:``}});return e?(0,b.jsx)(f,{className:`w-full max-w-3xl`,children:(0,b.jsx)(s,{className:`p-8 md:p-10`,children:(0,b.jsxs)(`div`,{className:`space-y-8 text-center`,children:[(0,b.jsx)(g,{title:`Check your email`,description:`\r
                      If an account exists with this email, a password reset link has been sent.`}),(0,b.jsx)(d,{to:p.ROOT,className:`\r
                ml-1\r
                font-semibold\r
                text-blue-600\r
                hover:text-blue-700\r
              `,children:`Continue to Home`})]})})}):(0,b.jsx)(f,{className:`w-full max-w-lg`,children:(0,b.jsx)(s,{className:`p-8 md:p-12`,children:(0,b.jsxs)(`div`,{className:`space-y-8`,children:[(0,b.jsx)(g,{title:`Forgot Password?`,description:`\r
              Enter your email and we will send you\r
              instructions to reset your password.\r
            `}),(0,b.jsxs)(`form`,{onSubmit:a.handleSubmit(async e=>{n.mutate(e.email,{onSuccess:()=>{t(!0),r.success(`If an account exists with this email, a password reset link has been sent.`)},onError:e=>{console.error(e);let t=e;r.error(t.response?.data.message||`Unable to create account. Please try again.`)}})}),className:`space-y-6`,children:[(0,b.jsx)(_,{control:a.control,name:`email`,label:`Email Address`,placeholder:`Enter your email address`,type:`email`,required:!0,icon:(0,b.jsx)(h,{className:`h-5 w-5`})}),(0,b.jsx)(o,{type:`submit`,loading:n.isPending,loadingText:`Sending email...`,children:`Send reset link`})]}),(0,b.jsxs)(d,{to:p.AUTH.LOGIN,className:`\r
              flex\r
              items-center\r
              justify-center\r
              gap-2\r
              text-sm\r
              font-medium\r
              text-blue-600\r
              hover:text-blue-700\r
            `,children:[(0,b.jsx)(c,{className:`h-4 w-4`}),`Back to Sign In`]})]})})})}export{x as default};