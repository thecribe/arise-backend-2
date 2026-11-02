import{a as e,t}from"./jsx-runtime-D_MnEzuy.js";import{n,t as r}from"./createLucideIcon-BJGvH109.js";import{n as i}from"./input-C7jSdc-z.js";import{a,l as o,y as s}from"./button-CO7nOzjO.js";import{c,d as l,n as u}from"./index.esm-DChJxQ-z.js";import{A as d,N as f,W as p,at as m,b as h,j as g,mt as _,nt as v,rt as y,v as b,wt as x,x as S}from"./index-ROCSi0CX.js";var C=r(`power`,[[`path`,{d:`M12 2v10`,key:`mnfbl`}],[`path`,{d:`M18.4 6.6a9 9 0 1 1-12.77.04`,key:`obofu9`}]]),w=e(n(),1),T=t(),E=({requirement:e,onEdit:t,onToggleStatus:n})=>{let[r,i]=(0,w.useState)(!1),a=(0,w.useRef)(null);return(0,w.useEffect)(()=>{let e=e=>{a.current&&!a.current.contains(e.target)&&i(!1)};return document.addEventListener(`mousedown`,e),()=>{document.removeEventListener(`mousedown`,e)}},[]),(0,T.jsx)(`article`,{className:`\r
        relative\r
        rounded-2xl\r
        border border-blue-200/60\r
        bg-white/50\r
        p-5\r
        shadow-sm\r
        backdrop-blur-xl\r
        transition\r
        hover:border-blue-300/70\r
        hover:shadow-md\r
        dark:border-blue-400/20\r
        dark:bg-slate-900/30\r
        dark:hover:border-blue-400/30\r
      `,children:(0,T.jsxs)(`div`,{className:`flex items-start gap-4`,children:[(0,T.jsx)(`div`,{className:`\r
            flex h-10 w-10 shrink-0 items-center justify-center\r
            rounded-xl\r
            border border-blue-200/70\r
            bg-blue-50/70\r
            text-sm font-semibold text-blue-700\r
            dark:border-blue-400/20\r
            dark:bg-blue-500/10\r
            dark:text-blue-300\r
          `,children:e.sortOrder}),(0,T.jsxs)(`div`,{className:`min-w-0 flex-1`,children:[(0,T.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2 pr-8`,children:[(0,T.jsx)(`h3`,{className:`truncate text-sm font-semibold text-slate-900 dark:text-white`,children:e.name}),(0,T.jsxs)(`span`,{className:`
                inline-flex shrink-0 items-center gap-1.5
                rounded-full
                border
                px-2.5 py-1
                text-[11px] font-medium
                ${e.active?`
                      border-emerald-200/70
                      bg-emerald-50/70
                      text-emerald-700
                      dark:border-emerald-400/20
                      dark:bg-emerald-500/10
                      dark:text-emerald-300
                    `:`
                      border-slate-200/70
                      bg-slate-50/70
                      text-slate-500
                      dark:border-slate-400/20
                      dark:bg-slate-500/10
                      dark:text-slate-400
                    `}
              `,children:[(0,T.jsx)(`span`,{className:`
                  h-1.5 w-1.5 rounded-full
                  ${e.active?`bg-emerald-500`:`bg-slate-400`}
                `}),e.active?`Active`:`Inactive`]})]}),(0,T.jsx)(`p`,{className:`mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400`,children:e.description||`No description provided.`})]}),(0,T.jsxs)(`div`,{ref:a,className:`absolute right-4 top-4`,children:[(0,T.jsx)(`button`,{type:`button`,onClick:()=>i(e=>!e),"aria-label":`Actions for ${e.name}`,"aria-expanded":r,className:`\r
              flex h-9 w-9 items-center justify-center\r
              rounded-xl\r
              text-slate-500\r
              transition\r
              hover:bg-blue-50\r
              hover:text-blue-700\r
              dark:text-slate-400\r
              dark:hover:bg-blue-500/10\r
              dark:hover:text-blue-300\r
            `,children:(0,T.jsx)(_,{className:`h-5 w-5`})}),r&&(0,T.jsxs)(`div`,{className:`\r
                absolute right-0 top-full z-50 mt-2\r
                w-44\r
                rounded-xl\r
                border border-blue-200/70\r
                bg-white/95\r
                p-1\r
                shadow-xl shadow-blue-950/10\r
                backdrop-blur-xl\r
                dark:border-blue-400/20\r
                dark:bg-slate-900/95\r
              `,children:[(0,T.jsxs)(`button`,{type:`button`,onClick:()=>{i(!1),t(e)},className:`\r
                  flex w-full items-center gap-2.5\r
                  rounded-lg\r
                  px-3 py-2.5\r
                  text-left text-sm\r
                  text-slate-700\r
                  transition\r
                  hover:bg-blue-50\r
                  hover:text-blue-700\r
                  dark:text-slate-200\r
                  dark:hover:bg-blue-500/10\r
                  dark:hover:text-blue-300\r
                `,children:[(0,T.jsx)(m,{className:`h-4 w-4`}),`Edit`]}),(0,T.jsxs)(`button`,{type:`button`,onClick:()=>{i(!1),n(e)},className:`\r
                  flex w-full items-center gap-2.5\r
                  rounded-lg\r
                  px-3 py-2.5\r
                  text-left text-sm\r
                  text-slate-700\r
                  transition\r
                  hover:bg-blue-50\r
                  hover:text-blue-700\r
                  dark:text-slate-200\r
                  dark:hover:bg-blue-500/10\r
                  dark:hover:text-blue-300\r
                `,children:[(0,T.jsx)(C,{className:`h-4 w-4`}),e.active?`Deactivate`:`Activate`]})]})]})]})})},D=({requirements:e,onEdit:t,onToggleStatus:n})=>e.length?(0,T.jsx)(`div`,{className:`space-y-3`,children:e.map(e=>(0,T.jsx)(E,{requirement:e,onEdit:t,onToggleStatus:n},e.id))}):(0,T.jsx)(`div`,{className:`\r
          flex min-h-[260px] items-center justify-center\r
          rounded-2xl\r
          border border-dashed border-blue-200/70\r
          bg-white/20\r
          px-6 py-10\r
          text-center\r
          dark:border-blue-400/20\r
          dark:bg-slate-900/20\r
        `,children:(0,T.jsxs)(`div`,{className:`max-w-sm`,children:[(0,T.jsx)(`h3`,{className:`text-sm font-semibold text-slate-800 dark:text-white`,children:`No training certificates configured`}),(0,T.jsx)(`p`,{className:`mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400`,children:`Add your first mandatory training certificate requirement to make it available during recruitment.`})]})}),O={getTrainingCertificateRequirements:async()=>(await a.get(`/training-certificate-requirements`)).data.data,createTrainingCertificateRequirement:async e=>(await a.post(`/training-certificate-requirements`,e)).data.data,updateTrainingCertificateRequirement:async(e,t)=>(await a.patch(`/training-certificate-requirements/${e}`,t)).data.data,updateTrainingCertificateRequirementStatus:async(e,t)=>(await a.patch(`/training-certificate-requirements/${e}/status`,{active:t})).data.data},k={all:[`settings`],trainingCertificateRequirements:()=>[...k.all,`training-certificate-requirements`],trainingCertificateRequirementList:()=>[...k.trainingCertificateRequirements(),`list`]},A=(e=!0)=>o({queryKey:k.trainingCertificateRequirementList(),queryFn:O.getTrainingCertificateRequirements,enabled:e}),j=()=>{let e=s();return x({mutationFn:e=>O.createTrainingCertificateRequirement(e),onSuccess:()=>{e.invalidateQueries({queryKey:k.trainingCertificateRequirementList()}),l.success(`Training certificate requirement created successfully.`)},onError:e=>{let t=e;l.error(t.response?.data?.message||`Unable to create training certificate requirement. Please try again.`)}})},M=e=>{let t=s();return x({mutationFn:t=>O.updateTrainingCertificateRequirement(e,t),onSuccess:()=>{t.invalidateQueries({queryKey:k.trainingCertificateRequirementList()}),l.success(`Training certificate requirement updated successfully.`)},onError:e=>{let t=e;l.error(t.response?.data?.message||`Unable to update training certificate requirement. Please try again.`)}})},N=e=>{let t=s();return x({mutationFn:t=>O.updateTrainingCertificateRequirementStatus(e,t),onSuccess:()=>{t.invalidateQueries({queryKey:k.trainingCertificateRequirementList()}),l.success(`Training certificate requirement status updated successfully.`)},onError:e=>{let t=e;l.error(t.response?.data?.message||`Unable to update training certificate requirement status. Please try again.`)}})},P=e(i(),1),F=[{id:`training-certificate-requirement-name`,name:`name`,type:h.TEXT,label:`Certificate Name`,placeholder:`e.g. Basic Life Support`,required:!0,width:S.FULL,order:1},{id:`training-certificate-requirement-description`,name:`description`,type:h.TEXTAREA,label:`Description`,placeholder:`Describe the certificate requirement`,helpText:`Provide any additional information applicants should know about this certificate.`,rows:4,width:S.FULL,order:2}],I=d({name:g().trim().min(1,`Certificate name is required`),description:g().trim()}),L=({open:e,requirement:t,onClose:n})=>{let r=!!t,i=j(),a=M(t?.id??``),o=r?a:i,s=c({resolver:f(I),defaultValues:{name:``,description:``},mode:`onTouched`}),{handleSubmit:l,reset:d}=s;(0,w.useEffect)(()=>{e&&d({name:t?.name??``,description:t?.description??``})},[e,t,d]);let m=()=>{o.isPending||(d({name:``,description:``}),n())},h=async e=>{try{await o.mutateAsync(e),d({name:``,description:``}),n()}catch{}};return e?(0,P.createPortal)((0,T.jsx)(`div`,{className:`\r
        fixed inset-0 z-50\r
        flex items-center justify-center\r
        bg-blue-950/30\r
        p-4\r
        backdrop-blur-sm\r
      `,children:(0,T.jsxs)(`div`,{className:`\r
          flex\r
          max-h-[90vh]\r
          w-full\r
          max-w-xl\r
          flex-col\r
          overflow-hidden\r
          rounded-2xl\r
          border border-blue-200/60\r
          bg-white/80\r
          shadow-2xl\r
          shadow-blue-900/10\r
          backdrop-blur-2xl\r
          dark:border-blue-400/20\r
          dark:bg-slate-900/80\r
        `,children:[(0,T.jsxs)(`div`,{className:`\r
            flex shrink-0 items-center justify-between gap-4\r
            border-b border-blue-100/70\r
            px-5 py-4\r
            dark:border-blue-400/20\r
          `,children:[(0,T.jsxs)(`div`,{className:`min-w-0`,children:[(0,T.jsx)(`h2`,{className:`text-lg font-semibold text-slate-900 dark:text-white`,children:r?`Edit Training Certificate`:`Add Training Certificate`}),(0,T.jsx)(`p`,{className:`mt-1 text-sm text-slate-500 dark:text-slate-400`,children:r?`Update this mandatory certificate requirement.`:`Add a mandatory certificate applicants must provide.`})]}),(0,T.jsx)(`button`,{type:`button`,onClick:m,disabled:o.isPending,"aria-label":`Close`,className:`\r
              flex h-9 w-9 shrink-0 items-center justify-center\r
              rounded-xl\r
              bg-blue-50/50\r
              text-slate-500\r
              transition\r
              hover:bg-blue-100/70\r
              hover:text-blue-700\r
              disabled:cursor-not-allowed\r
              disabled:opacity-50\r
              dark:bg-blue-500/10\r
              dark:text-slate-400\r
              dark:hover:bg-blue-500/20\r
              dark:hover:text-blue-300\r
            `,children:(0,T.jsx)(p,{className:`h-5 w-5`})})]}),(0,T.jsx)(u,{...s,children:(0,T.jsxs)(`form`,{onSubmit:l(h),className:`flex min-h-0 flex-1 flex-col`,children:[(0,T.jsx)(`div`,{className:`flex-1 overflow-y-auto px-5 py-5`,children:(0,T.jsx)(b,{fields:F,config:{mode:r?`edit`:`create`,canEdit:!0,disabled:o.isPending,readOnly:!1}})}),(0,T.jsxs)(`div`,{className:`\r
                flex shrink-0\r
                flex-col-reverse gap-2\r
                border-t border-blue-100/70\r
                bg-blue-50/20\r
                px-5 py-4\r
                sm:flex-row\r
                sm:justify-end\r
                dark:border-blue-400/20\r
                dark:bg-blue-500/5\r
              `,children:[(0,T.jsx)(`button`,{type:`button`,onClick:m,disabled:o.isPending,className:`\r
                  w-full\r
                  rounded-xl\r
                  border border-blue-200/60\r
                  bg-white/50\r
                  px-4 py-2.5\r
                  text-sm font-medium\r
                  text-slate-700\r
                  transition\r
                  hover:bg-blue-50/70\r
                  disabled:cursor-not-allowed\r
                  disabled:opacity-60\r
                  sm:w-auto\r
                  dark:border-blue-400/20\r
                  dark:bg-slate-900/30\r
                  dark:text-slate-200\r
                  dark:hover:bg-blue-500/10\r
                `,children:`Cancel`}),(0,T.jsx)(`button`,{type:`submit`,disabled:o.isPending,className:`\r
                  inline-flex w-full items-center justify-center\r
                  rounded-xl\r
                  bg-blue-600\r
                  px-4 py-2.5\r
                  text-sm font-medium\r
                  text-white\r
                  shadow-lg\r
                  shadow-blue-950/20\r
                  transition\r
                  hover:bg-blue-500\r
                  disabled:cursor-not-allowed\r
                  disabled:opacity-60\r
                  sm:w-auto\r
                `,children:o.isPending?`Saving...`:r?`Save Changes`:`Add Certificate`})]})]})})]})}),document.body):null},R=({open:e,requirement:t,isPending:n=!1,onConfirm:r,onClose:i})=>{if(!e||!t)return null;let a=!t.active;return(0,P.createPortal)((0,T.jsx)(`div`,{className:`\r
        fixed inset-0 z-50\r
        flex items-center justify-center\r
        bg-blue-950/30\r
        p-4\r
        backdrop-blur-sm\r
      `,children:(0,T.jsxs)(`div`,{className:`\r
          w-full max-w-md\r
          rounded-2xl\r
          border border-blue-200/60\r
          bg-white/85\r
          shadow-2xl shadow-blue-900/10\r
          backdrop-blur-2xl\r
          dark:border-blue-400/20\r
          dark:bg-slate-900/85\r
        `,children:[(0,T.jsxs)(`div`,{className:`\r
            flex items-center justify-between gap-4\r
            border-b border-blue-100/70\r
            px-5 py-4\r
            dark:border-blue-400/20\r
          `,children:[(0,T.jsxs)(`div`,{className:`flex min-w-0 items-center gap-3`,children:[(0,T.jsx)(`div`,{className:`\r
                flex h-10 w-10 shrink-0 items-center justify-center\r
                rounded-xl\r
                border border-blue-200/70\r
                bg-blue-50/70\r
                text-blue-600\r
                dark:border-blue-400/20\r
                dark:bg-blue-500/10\r
                dark:text-blue-300\r
              `,children:(0,T.jsx)(C,{className:`h-5 w-5`})}),(0,T.jsx)(`h2`,{className:`text-lg font-semibold text-slate-900 dark:text-white`,children:a?`Activate Certificate`:`Deactivate Certificate`})]}),(0,T.jsx)(`button`,{type:`button`,onClick:i,disabled:n,"aria-label":`Close`,className:`\r
              flex h-9 w-9 shrink-0 items-center justify-center\r
              rounded-xl\r
              bg-blue-50/50\r
              text-slate-500\r
              transition\r
              hover:bg-blue-100/70\r
              hover:text-blue-700\r
              disabled:cursor-not-allowed\r
              disabled:opacity-50\r
              dark:bg-blue-500/10\r
              dark:text-slate-400\r
              dark:hover:bg-blue-500/20\r
              dark:hover:text-blue-300\r
            `,children:(0,T.jsx)(p,{className:`h-5 w-5`})})]}),(0,T.jsxs)(`div`,{className:`px-5 py-5`,children:[(0,T.jsxs)(`p`,{className:`text-sm leading-6 text-slate-600 dark:text-slate-300`,children:[`Are you sure you want to`,` `,(0,T.jsx)(`span`,{className:`font-semibold`,children:a?`activate`:`deactivate`}),` `,(0,T.jsx)(`span`,{className:`font-semibold text-slate-900 dark:text-white`,children:t.name}),`?`]}),!a&&(0,T.jsx)(`div`,{className:`\r
                mt-4\r
                rounded-xl\r
                border border-amber-200/70\r
                bg-amber-50/60\r
                px-4 py-3\r
                text-sm leading-5\r
                text-amber-700\r
                dark:border-amber-400/20\r
                dark:bg-amber-500/10\r
                dark:text-amber-300\r
              `,children:`Deactivating this requirement will prevent it from being treated as an active mandatory training requirement for new recruitment activity.`})]}),(0,T.jsxs)(`div`,{className:`\r
            flex flex-col-reverse gap-2\r
            border-t border-blue-100/70\r
            bg-blue-50/20\r
            px-5 py-4\r
            sm:flex-row\r
            sm:justify-end\r
            dark:border-blue-400/20\r
            dark:bg-blue-500/5\r
          `,children:[(0,T.jsx)(`button`,{type:`button`,onClick:i,disabled:n,className:`\r
              w-full\r
              rounded-xl\r
              border border-blue-200/60\r
              bg-white/50\r
              px-4 py-2.5\r
              text-sm font-medium\r
              text-slate-700\r
              transition\r
              hover:bg-blue-50/70\r
              disabled:cursor-not-allowed\r
              disabled:opacity-60\r
              sm:w-auto\r
              dark:border-blue-400/20\r
              dark:bg-slate-900/30\r
              dark:text-slate-200\r
              dark:hover:bg-blue-500/10\r
            `,children:`Cancel`}),(0,T.jsxs)(`button`,{type:`button`,onClick:r,disabled:n,className:`\r
              inline-flex w-full items-center justify-center gap-2\r
              rounded-xl\r
              bg-blue-600\r
              px-4 py-2.5\r
              text-sm font-medium\r
              text-white\r
              shadow-lg shadow-blue-950/20\r
              transition\r
              hover:bg-blue-500\r
              disabled:cursor-not-allowed\r
              disabled:opacity-60\r
              sm:w-auto\r
            `,children:[(0,T.jsx)(C,{className:`h-4 w-4`}),n?`Updating...`:a?`Activate`:`Deactivate`]})]})]})}),document.body)},z=()=>{let[e,t]=(0,w.useState)(!1),[n,r]=(0,w.useState)(null),[i,a]=(0,w.useState)(null),o=N(i?.id??``),{data:s,isLoading:c,isFetching:l,isError:u,refetch:d}=A(),f=Array.isArray(s)?s:[];return(0,T.jsxs)(`section`,{className:`\r
        rounded-2xl\r
        border border-blue-200/60\r
        bg-white/40\r
        shadow-sm\r
        backdrop-blur-xl\r
        dark:border-blue-400/20\r
        dark:bg-slate-900/30\r
      `,children:[(0,T.jsxs)(`div`,{className:`\r
          flex flex-col gap-4\r
          border-b border-blue-100/70\r
          px-5 py-5\r
          sm:flex-row\r
          sm:items-center\r
          sm:justify-between\r
          dark:border-blue-400/20\r
        `,children:[(0,T.jsxs)(`div`,{className:`min-w-0`,children:[(0,T.jsx)(`h2`,{className:`text-lg font-semibold text-slate-900 dark:text-white`,children:`Training Certificates`}),(0,T.jsx)(`p`,{className:`mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400`,children:`Manage the mandatory training certificates applicants must provide during recruitment.`})]}),(0,T.jsxs)(`div`,{className:`flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row`,children:[(0,T.jsxs)(`button`,{type:`button`,onClick:()=>d(),disabled:l,className:`\r
              inline-flex w-full items-center justify-center gap-2\r
              rounded-xl\r
              border border-blue-200/60\r
              bg-white/50\r
              px-4 py-2.5\r
              text-sm font-medium\r
              text-slate-700\r
              shadow-sm\r
              backdrop-blur-sm\r
              transition\r
              hover:bg-blue-50/70\r
              disabled:cursor-not-allowed\r
              disabled:opacity-60\r
              sm:w-auto\r
              dark:border-blue-400/20\r
              dark:bg-slate-900/30\r
              dark:text-slate-200\r
              dark:hover:bg-blue-500/10\r
            `,children:[(0,T.jsx)(v,{className:`h-4 w-4 ${l?`animate-spin`:``}`}),`Refresh`]}),(0,T.jsxs)(`button`,{type:`button`,onClick:()=>{r(null),t(!0)},className:`\r
              inline-flex w-full items-center justify-center gap-2\r
              rounded-xl\r
              bg-blue-600\r
              px-4 py-2.5\r
              text-sm font-medium\r
              text-white\r
              shadow-lg shadow-blue-950/20\r
              transition\r
              hover:bg-blue-500\r
              sm:w-auto\r
            `,children:[(0,T.jsx)(y,{className:`h-4 w-4`}),`Add Certificate`]})]})]}),(0,T.jsx)(`div`,{className:`p-5`,children:c?(0,T.jsx)(`div`,{className:`space-y-3`,children:Array.from({length:3}).map((e,t)=>(0,T.jsx)(`div`,{className:`\r
                  h-28\r
                  animate-pulse\r
                  rounded-2xl\r
                  border border-blue-100/60\r
                  bg-blue-50/40\r
                  dark:border-blue-400/10\r
                  dark:bg-slate-800/30\r
                `},t))}):u?(0,T.jsx)(`div`,{className:`\r
              flex min-h-[260px] items-center justify-center\r
              rounded-2xl\r
              border border-red-200/60\r
              bg-red-50/40\r
              px-6 py-10\r
              text-center\r
              dark:border-red-400/20\r
              dark:bg-red-500/5\r
            `,children:(0,T.jsxs)(`div`,{children:[(0,T.jsx)(`h3`,{className:`text-sm font-semibold text-red-700 dark:text-red-300`,children:`Unable to load training certificates`}),(0,T.jsx)(`p`,{className:`mt-1.5 text-sm text-red-600/70 dark:text-red-300/60`,children:`Something went wrong while loading the requirements.`}),(0,T.jsx)(`button`,{type:`button`,onClick:()=>d(),className:`\r
                  mt-4\r
                  rounded-xl\r
                  bg-blue-600\r
                  px-4 py-2\r
                  text-sm font-medium\r
                  text-white\r
                  transition\r
                  hover:bg-blue-500\r
                `,children:`Try Again`})]})}):(0,T.jsx)(D,{requirements:f,onEdit:e=>{r(e),t(!0)},onToggleStatus:e=>{a(e)}})}),(0,T.jsx)(L,{open:e,requirement:n,onClose:()=>{t(!1),r(null)}}),(0,T.jsx)(R,{open:!!i,requirement:i,isPending:o.isPending,onConfirm:async()=>{if(i)try{await o.mutateAsync(!i.active),a(null)}catch{}},onClose:()=>{o.isPending||a(null)}})]})};export{z as default};