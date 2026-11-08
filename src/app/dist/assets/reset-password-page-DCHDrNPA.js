import{a as e,t}from"./jsx-runtime-D_MnEzuy.js";import{n}from"./createLucideIcon-BJGvH109.js";import{f as r,l as i}from"./input-C_fBIl7z.js";import{B as a,C as o,E as s,F as c,Nt as l,Ot as u,S as d,T as f,V as p,b as m,ft as h,jt as g,w as _}from"./index-CiVnOsJK.js";var v=e(n(),1),y=t();function b(){let e=g(),[t]=l(),n=t.get(`token`),[b,x]=(0,v.useState)(!1),S=a(),C=i({resolver:c(d),defaultValues:{password:``,confirmPassword:``}});return(0,v.useEffect)(()=>{n||(r.error(`Reset password token is missing.`),e(p.AUTH.FORGOT_PASSWORD,{replace:!0}))},[n,e]),n?b?(0,y.jsx)(f,{className:`w-full max-w-xl`,children:(0,y.jsx)(s,{className:`p-8 md:p-10`,children:(0,y.jsxs)(`div`,{className:`space-y-8`,children:[(0,y.jsx)(_,{title:`Password Created`,description:`\r
                Your account has been activated successfully.\r
              `}),(0,y.jsxs)(`div`,{className:`space-y-6 text-center`,children:[(0,y.jsx)(`p`,{className:`text-sm text-slate-600`,children:`You can now sign in using your email address and newly created password.`}),(0,y.jsx)(u,{to:p.AUTH.LOGIN,className:`\r
                  inline-flex\r
                  font-semibold\r
                  text-blue-600\r
                  hover:text-blue-700\r
                `,children:`Continue to Login`})]})]})})}):(0,y.jsx)(f,{className:`w-full max-w-lg`,children:(0,y.jsx)(s,{className:`p-8 md:p-12`,children:(0,y.jsxs)(`div`,{className:`space-y-8`,children:[(0,y.jsx)(_,{title:`Create New Password`,description:`\r
              Choose a strong password for your Airse account.\r
            `}),(0,y.jsxs)(`form`,{onSubmit:C.handleSubmit(async e=>{S.mutate({token:n,password:e.password,confirmPassword:e.confirmPassword},{onSuccess:()=>{r.success(`Password created successfully.`),x(!0)},onError:e=>{let t=e;r.error(t.response?.data.message??`Unable to reset password.`)}})}),className:`space-y-6`,children:[(0,y.jsx)(m,{control:C.control,name:`password`,label:`New Password`,placeholder:`Enter your new password`,required:!0,icon:(0,y.jsx)(h,{className:`h-5 w-5`})}),(0,y.jsx)(m,{control:C.control,name:`confirmPassword`,label:`Confirm Password`,placeholder:`Confirm your new password`,required:!0,icon:(0,y.jsx)(h,{className:`h-5 w-5`})}),(0,y.jsx)(o,{type:`submit`,loading:S.isPending,loadingText:`Updating password...`,children:`Reset password`})]}),(0,y.jsx)(u,{to:p.AUTH.LOGIN,className:`\r
              text-center\r
              block\r
              text-sm\r
              font-medium\r
              text-blue-600\r
              hover:text-blue-700\r
            `,children:`Back to Sign In`})]})})}):null}export{b as default};