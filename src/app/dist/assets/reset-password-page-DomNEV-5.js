import{a as e,t}from"./jsx-runtime-D_MnEzuy.js";import{n}from"./createLucideIcon-BJGvH109.js";import{c as r,d as i}from"./index.esm-DChJxQ-z.js";import{D as a,Dt as o,F as s,H as c,I as l,M as u,N as d,P as f,T as p,Tt as m,V as h,kt as g,lt as _}from"./index-ROCSi0CX.js";var v=e(n(),1),y=t();function b(){let e=o(),[t]=g(),n=t.get(`token`),[b,x]=(0,v.useState)(!1),S=h(),C=r({resolver:d(a),defaultValues:{password:``,confirmPassword:``}});return(0,v.useEffect)(()=>{n||(i.error(`Reset password token is missing.`),e(c.AUTH.FORGOT_PASSWORD,{replace:!0}))},[n,e]),n?b?(0,y.jsx)(s,{className:`w-full max-w-xl`,children:(0,y.jsx)(l,{className:`p-8 md:p-10`,children:(0,y.jsxs)(`div`,{className:`space-y-8`,children:[(0,y.jsx)(f,{title:`Password Created`,description:`\r
                Your account has been activated successfully.\r
              `}),(0,y.jsxs)(`div`,{className:`space-y-6 text-center`,children:[(0,y.jsx)(`p`,{className:`text-sm text-slate-600`,children:`You can now sign in using your email address and newly created password.`}),(0,y.jsx)(m,{to:c.AUTH.LOGIN,className:`\r
                  inline-flex\r
                  font-semibold\r
                  text-blue-600\r
                  hover:text-blue-700\r
                `,children:`Continue to Login`})]})]})})}):(0,y.jsx)(s,{className:`w-full max-w-lg`,children:(0,y.jsx)(l,{className:`p-8 md:p-12`,children:(0,y.jsxs)(`div`,{className:`space-y-8`,children:[(0,y.jsx)(f,{title:`Create New Password`,description:`\r
              Choose a strong password for your Airse account.\r
            `}),(0,y.jsxs)(`form`,{onSubmit:C.handleSubmit(async e=>{S.mutate({token:n,password:e.password,confirmPassword:e.confirmPassword},{onSuccess:()=>{i.success(`Password created successfully.`),x(!0)},onError:e=>{let t=e;i.error(t.response?.data.message??`Unable to reset password.`)}})}),className:`space-y-6`,children:[(0,y.jsx)(p,{control:C.control,name:`password`,label:`New Password`,placeholder:`Enter your new password`,required:!0,icon:(0,y.jsx)(_,{className:`h-5 w-5`})}),(0,y.jsx)(p,{control:C.control,name:`confirmPassword`,label:`Confirm Password`,placeholder:`Confirm your new password`,required:!0,icon:(0,y.jsx)(_,{className:`h-5 w-5`})}),(0,y.jsx)(u,{type:`submit`,loading:S.isPending,loadingText:`Updating password...`,children:`Reset password`})]}),(0,y.jsx)(m,{to:c.AUTH.LOGIN,className:`\r
              text-center\r
              block\r
              text-sm\r
              font-medium\r
              text-blue-600\r
              hover:text-blue-700\r
            `,children:`Back to Sign In`})]})})}):null}export{b as default};