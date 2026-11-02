import{a as e,t}from"./jsx-runtime-D_MnEzuy.js";import{n,t as r}from"./createLucideIcon-BJGvH109.js";import{a as i,c as a,l as o,n as s,y as c}from"./button-CO7nOzjO.js";import{c as l,d as u,l as d,n as f,s as p}from"./index.esm-DChJxQ-z.js";import{C as m,J as h,N as g,Q as _,S as v,_ as y,_t as b,ct as x,et as S,ft as ee,ht as C,q as te,rt as w,tt as T,v as E,vt as D,wt as O}from"./index-ROCSi0CX.js";import{t as k}from"./phase-status-JC01Eg9x.js";var A=r(`file-pen`,[[`path`,{d:`M12.659 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v9.34`,key:`o6klzx`}],[`path`,{d:`M14 2v5a1 1 0 0 0 1 1h5`,key:`wfsgrz`}],[`path`,{d:`M10.378 12.622a1 1 0 0 1 3 3.003L8.36 20.637a2 2 0 0 1-.854.506l-2.867.837a.5.5 0 0 1-.62-.62l.836-2.869a2 2 0 0 1 .506-.853z`,key:`zhnas1`}]]),ne=r(`layers`,[[`path`,{d:`M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z`,key:`zw3jo`}],[`path`,{d:`M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12`,key:`1wduqc`}],[`path`,{d:`M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17`,key:`kqbvx6`}]]),j=r(`loader`,[[`path`,{d:`M12 2v4`,key:`3427ic`}],[`path`,{d:`m16.2 7.8 2.9-2.9`,key:`r700ao`}],[`path`,{d:`M18 12h4`,key:`wj9ykh`}],[`path`,{d:`m16.2 16.2 2.9 2.9`,key:`1bxg5t`}],[`path`,{d:`M12 18v4`,key:`jadmvz`}],[`path`,{d:`m4.9 19.1 2.9-2.9`,key:`bwix9q`}],[`path`,{d:`M2 12h4`,key:`j09sii`}],[`path`,{d:`m4.9 4.9 2.9 2.9`,key:`giyufr`}]]),M=r(`message-square`,[[`path`,{d:`M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z`,key:`18887p`}]]),N=r(`refresh-ccw`,[[`path`,{d:`M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8`,key:`14sxne`}],[`path`,{d:`M3 3v5h5`,key:`1xhq8a`}],[`path`,{d:`M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16`,key:`1hlbsb`}],[`path`,{d:`M16 16h5v5`,key:`ccwih5`}]]),P=e(n(),1),F=(0,P.createContext)(null);function I(){let e=(0,P.useContext)(F);if(!e)throw Error(`useApplicationContext must be used inside ApplicationProvider.`);return e}var L={async getApplicationPhases(){return(await i.get(`/application-definitions/phases`)).data.data},async getPhaseSections(e){return(await i.get(`/application-definitions/phases/${e}/sections`)).data.data}},R={async getApplicantApplication(){return(await i.get(`/applicant-application`)).data.data},async getApplicantSection(e){let{data:t}=await i.get(`/applicant/sections/${e}`);return t},async getSectionReviewComments(e){return(await i.get(`/applicant-application/sections/${e}/review-comments`)).data.data}},z={all:[`application-definition`],phases:()=>[...z.all,`phases`],sections:e=>[...z.all,`sections`,e],fields:e=>[...z.all,`fields`,e]},B={all:[`applicant-application`],application:()=>[...B.all,`application`],section:e=>[...B.all,`section`,e]},V={all:[`application-review`],sectionComments:e=>[...V.all,`section-comments`,e]},H={async getApplicantSection(e){return(await i.get(`/applicant-application/sections/${e}/values`)).data.data},async saveDraft(e){let{sectionId:t,values:n}=e,r=y(n),{data:a}=await i.patch(`/applicant-application/sections/${t}/values`,r);return a},async submitSection(e){let{sectionId:t,values:n}=e,r=y(n),{data:a}=await i.post(`/applicant-application/sections/${t}/submit`,r);return a}};function U(){let e=c();return O({mutationFn:H.saveDraft,onSuccess:async(t,n)=>{await e.invalidateQueries({queryKey:B.application()}),await e.invalidateQueries({queryKey:[`application`,`section`,n.sectionId]})}})}function W(){let e=c();return O({mutationFn:H.submitSection,onSuccess:async(t,n)=>{await e.invalidateQueries({queryKey:B.application()}),await e.invalidateQueries({queryKey:[`application`,`section`,n.sectionId]})}})}var G=t();function K(){let{handleSubmit:e}=d(),{activeSection:t,activeApplicantSection:n,canEdit:r,canSubmit:i}=I(),a=U(),o=W(),s=e=>{console.log(`Invalid form:`,e)};function c(e){let n=t.repeatable?e[t.id]:e;a.mutate({sectionId:t.id,values:n},{onSuccess:async e=>{u.success(e.message)},onError:e=>{let t=e;u.error(t.response?.data.message||`Unable to create account. Please try again.`)}})}function l(e){let n=t.repeatable?e[t.id]:e;o.mutate({sectionId:t.id,values:n},{onSuccess:async e=>{u.success(e.message)},onError:e=>{let t=e;u.error(t.response?.data.message||`Unable to create account. Please try again.`)}})}return(0,G.jsx)(`footer`,{className:`\r
        mt-8\r
        rounded-3xl\r
        border\r
        border-white/20\r
        bg-white/10\r
        backdrop-blur-xl\r
        shadow-lg\r
        p-6\r
      `,children:(0,G.jsxs)(`div`,{className:`flex flex-col gap-4 md:flex-row md:items-center md:justify-between`,children:[(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`p`,{className:`text-sm text-slate-500`,children:`Current Status`}),(0,G.jsx)(`p`,{className:`mt-1 font-semibold text-slate-800`,children:n.status})]}),(0,G.jsxs)(`div`,{className:`flex flex-wrap gap-3`,children:[r&&(0,G.jsxs)(`button`,{type:`button`,onClick:e(c,s),disabled:a.isPending,className:`\r
                inline-flex\r
                items-center\r
                gap-2\r
                rounded-xl\r
                border\r
                border-blue-300\r
                bg-white/70\r
                px-5\r
                py-3\r
                text-sm\r
                font-medium\r
                text-blue-700\r
                transition-all\r
                hover:bg-blue-50\r
                disabled:cursor-not-allowed\r
                disabled:opacity-50\r
              `,children:[(0,G.jsx)(S,{className:`h-4 w-4`}),a.isPending?`Saving...`:`Save Draft`]}),i&&(0,G.jsxs)(`button`,{type:`button`,onClick:e(l),disabled:o.isPending,className:`\r
                inline-flex\r
                items-center\r
                gap-2\r
                rounded-xl\r
                bg-blue-600\r
                px-5\r
                py-3\r
                text-sm\r
                font-medium\r
                text-white\r
                transition-all\r
                hover:bg-blue-700\r
                disabled:cursor-not-allowed\r
                disabled:opacity-50\r
              `,children:[(0,G.jsx)(_,{className:`h-4 w-4`}),o.isPending?`Submitting...`:`Submit Section`]})]})]})})}function q(){let{applicantApplication:e,currentPhase:t,activeSection:n,activeApplicantSection:r}=I(),i=e.phases.length,a=e.phases.filter(e=>e.status===k.APPROVED).length;return(0,G.jsx)(`section`,{className:`\r
        rounded-3xl\r
        border border-white/20\r
        bg-white/70\r
        px-4\r
        py-4\r
        shadow-lg\r
        backdrop-blur-xl\r
        sm:px-5\r
      `,children:(0,G.jsxs)(`div`,{className:`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between`,children:[(0,G.jsxs)(`div`,{className:`flex min-w-1/2 items-start gap-3`,children:[(0,G.jsx)(`div`,{className:`\r
              flex\r
              h-11\r
              w-11\r
              shrink-0\r
              items-center\r
              justify-center\r
              rounded-2xl\r
              bg-blue-500/15\r
              text-blue-600\r
            `,children:(0,G.jsx)(ee,{className:`h-5 w-5`})}),(0,G.jsxs)(`div`,{className:`min-w-0`,children:[(0,G.jsxs)(`div`,{className:`flex flex-wrap items-center gap-x-2 gap-y-0.5`,children:[(0,G.jsx)(`h1`,{className:`text-lg font-bold text-slate-900 sm:text-xl`,children:`Application`}),(0,G.jsx)(`span`,{className:`text-slate-300`,children:`•`}),(0,G.jsx)(`span`,{className:`text-sm font-semibold text-blue-700 sm:text-base`,children:t.title})]}),t.description&&(0,G.jsx)(`p`,{className:`mt-0.5 line-clamp-1 text-xs text-slate-500 sm:text-sm`,children:t.description}),(0,G.jsxs)(`div`,{className:`mt-2 flex flex-wrap items-center gap-1.5`,children:[(0,G.jsx)(`span`,{className:`\r
                  rounded-full\r
                  bg-blue-100\r
                  px-2.5\r
                  py-1\r
                  text-xs\r
                  font-medium\r
                  text-blue-700\r
                `,children:n.title}),(0,G.jsx)(`span`,{className:`\r
                  rounded-full\r
                  bg-slate-100\r
                  px-2.5\r
                  py-1\r
                  text-xs\r
                  font-medium\r
                  capitalize\r
                  text-slate-600\r
                `,children:r.status})]})]})]}),(0,G.jsxs)(`div`,{className:`\r
            flex\r
            items-center\r
            gap-5\r
            border-t\r
            border-slate-200/70\r
            pt-3\r
            lg:min-w-1/2\r
            lg:border-t-0\r
            lg:border-l\r
            lg:pl-5\r
            lg:pt-0\r
          `,children:[(0,G.jsxs)(`div`,{className:`hidden items-center gap-2.5 sm:flex`,children:[(0,G.jsx)(`div`,{className:`rounded-xl bg-blue-500/10 p-2`,children:(0,G.jsx)(ne,{className:`h-4 w-4 text-blue-600`})}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`p`,{className:`text-[10px] font-medium uppercase tracking-wide text-slate-400`,children:`Phase`}),(0,G.jsx)(`p`,{className:`max-w-[120px] truncate text-sm font-semibold text-slate-800`,children:t.title})]})]}),(0,G.jsxs)(`div`,{className:`flex shrink-0 items-center gap-2`,children:[(0,G.jsx)(`div`,{className:`rounded-xl bg-green-500/10 p-2`,children:(0,G.jsx)(b,{className:`h-4 w-4 text-green-600`})}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`p`,{className:`text-[10px] font-medium uppercase tracking-wide text-slate-400`,children:`Completed`}),(0,G.jsxs)(`p`,{className:`text-sm font-semibold text-slate-800`,children:[a,`/`,i]})]})]}),(0,G.jsxs)(`div`,{className:`min-w-0 flex-1`,children:[(0,G.jsxs)(`div`,{className:`flex items-center justify-between gap-2`,children:[(0,G.jsx)(`p`,{className:`text-[10px] font-medium uppercase tracking-wide text-slate-400`,children:`Progress`}),(0,G.jsxs)(`span`,{className:`text-lg font-bold text-blue-700`,children:[e.progress,`%`]})]}),(0,G.jsx)(`div`,{className:`mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200`,children:(0,G.jsx)(`div`,{className:`\r
                  h-full\r
                  rounded-full\r
                  bg-blue-600\r
                  transition-all\r
                  duration-500\r
                `,style:{width:`${e.progress}%`}})})]})]})]})})}function J(){return o({queryKey:z.phases(),queryFn:L.getApplicationPhases,staleTime:1/0})}function Y(){return o({queryKey:B.application(),queryFn:R.getApplicantApplication})}function X(e){return o({queryKey:z.sections(e??``),queryFn:()=>L.getPhaseSections(e),enabled:!!e})}var Z={LOCKED:`locked`,IN_PROGRESS:`in_progress`,SUBMITTED:`submitted`,APPROVED:`approved`,REJECTED:`rejected`};function re({children:e}){let{data:t=[]}=J(),{data:n}=Y(),r=(0,P.useMemo)(()=>{if(n)return t.find(e=>e.id===n.currentPhaseId)},[t,n]),i=(0,P.useMemo)(()=>{if(!n)return[];let e=n.phases,r=new Map(e.map(e=>[e.phaseId,e]));return t.map(e=>({...e,...r.get(e.id)??{}}))},[t,n]),[a,o]=(0,P.useState)(),s=a??r?.id,c=(0,P.useMemo)(()=>{if(s)return t.find(e=>e.id===s)},[t,s]),l=(0,P.useMemo)(()=>{if(!(!s||!n))return n.phases.find(e=>e.phaseId===s)},[s,n]),{data:u=[]}=X(s),d=(0,P.useMemo)(()=>{if(n)return u.find(e=>e.id===n.currentSectionId)},[u,n]),[f,p]=(0,P.useState)(),m=f??u[0]?.id,h=(0,P.useMemo)(()=>{if(m)return u.find(e=>e.id===m)},[u,m]),g=(0,P.useMemo)(()=>{if(!(!l||!h))return l.sections.find(e=>e.sectionId===h.id)},[l,h]),_=(0,P.useMemo)(()=>{let e=new Map;return l&&l.sections.forEach(t=>{e.set(t.sectionId,t)}),e},[l]),v=!!h,y=g?.status===k.IN_PROGRESS||g?.status===k.REJECTED,b=y,x=(0,P.useMemo)(()=>{let e=n?.phases.filter(e=>e.status===Z.APPROVED).length??0,t=u.length,a=u.filter(e=>_.get(e.id)?.status===Z.APPROVED).length;return{percentage:n?.progress??0,totalPhases:n?.phases.length??0,completedPhases:e,totalSections:t,completedSections:a,currentPhaseIndex:i.findIndex(e=>e.id===r?.id)+1,currentSectionIndex:u.findIndex(e=>e.id===d?.id)+1}},[n,i,r,d,u,_]),S=(0,P.useMemo)(()=>{let e=u.findIndex(e=>e.id===h?.id);return{previousSection:e>0?u[e-1]:void 0,nextSection:e>=0&&e<u.length-1?u[e+1]:void 0,isFirstSection:e===0,isLastSection:e===u.length-1}},[u,h]);return!n||!r||!c||!l||!h||!g?null:(0,G.jsx)(F.Provider,{value:{applicationPhase:t,applicantApplication:n,availablePhases:i,currentPhase:r,activePhase:c,activeApplicantPhase:l,currentSection:d,activeSection:h,activeApplicantSection:g,sectionRecordMap:_,progressSummary:x,navigationSummary:S,selectPhase:e=>{o(e),p(void 0)},selectSection:e=>{p(e)},sections:u,canView:v,canEdit:y,canSubmit:b},children:e})}var Q={[k.LOCKED]:{icon:x,container:`border-slate-200 bg-slate-100 text-slate-400`},[k.IN_PROGRESS]:{icon:j,container:`border-slate-200 bg-slate-100 text-slate-400`},[k.DRAFT]:{icon:C,container:`border-blue-300 bg-blue-50 text-blue-700`},[k.SUBMITTED]:{icon:C,container:`border-amber-300 bg-amber-50 text-amber-700`},[k.REJECTED]:{icon:T,container:`border-red-300 bg-red-50 text-red-700`},[k.APPROVED]:{icon:b,container:`border-green-300 bg-green-50 text-green-700`}};function ie(){let{availablePhases:e,activePhase:t,selectPhase:n}=I(),r=[...e].sort((e,t)=>e.order-t.order),i=new Map(r.map(e=>[e.id,e])),a=e=>e!==k.LOCKED&&!!e;return(0,G.jsxs)(`section`,{className:`\r
        rounded-2xl\r
        border border-white/20\r
        bg-white/70\r
        px-3\r
        py-3\r
        shadow-md\r
        backdrop-blur-xl\r
        sm:px-4\r
        sm:py-3.5\r
      `,children:[(0,G.jsxs)(`div`,{className:`mb-2.5 flex items-center justify-between`,children:[(0,G.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,G.jsx)(`h2`,{className:`text-sm font-semibold text-slate-900 sm:text-base`,children:`Application Journey`}),(0,G.jsx)(`span`,{className:`\r
              rounded-full\r
              bg-blue-50\r
              px-2\r
              py-0.5\r
              text-[10px]\r
              font-medium\r
              text-blue-600\r
              sm:text-xs\r
            `,children:r.length})]}),(0,G.jsx)(`span`,{className:`text-[10px] text-slate-400 sm:text-xs`,children:`Scroll to view`})]}),(0,G.jsx)(`div`,{className:`\r
          flex\r
          gap-2\r
          overflow-x-auto\r
          overflow-y-hidden\r
          pb-1\r
          snap-x\r
          snap-mandatory\r
          scroll-smooth\r
          touch-pan-x\r
          scrollbar-thin\r
        `,children:r.map(e=>{let r=i.get(e.id);if(!r)return null;let o=r.status&&Q[r.status]?Q[r.status]:Q[k.LOCKED],s=o.icon,c=e.id===t.id,l=a(r.status);return(0,G.jsxs)(`button`,{type:`button`,disabled:!l,onClick:t=>{t.preventDefault(),l&&n(e.id)},className:`
                group
                w-56
                min-w-56
                shrink-0
                snap-start
                rounded-xl
                border
                px-3
                py-2.5
                text-left
                transition-all
                duration-200

                ${o.container}

                ${c?`
                      ring-2
                      ring-blue-500/70
                      shadow-sm
                    `:`
                      hover:-translate-y-0.5
                      hover:shadow-sm
                    `}

                disabled:cursor-not-allowed
              `,children:[(0,G.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,G.jsx)(`div`,{className:`\r
                    flex\r
                    h-7\r
                    w-7\r
                    shrink-0\r
                    items-center\r
                    justify-center\r
                    rounded-lg\r
                    bg-white/60\r
                  `,children:(0,G.jsx)(s,{className:`
                      h-4
                      w-4
                      shrink-0
                      ${r.status===k.IN_PROGRESS?`animate-spin`:``}
                    `})}),(0,G.jsx)(`h3`,{className:`truncate text-sm font-semibold`,children:e.title})]}),e.description&&(0,G.jsx)(`p`,{className:`\r
                    mt-1.5\r
                    line-clamp-1\r
                    text-[11px]\r
                    leading-4\r
                    opacity-75\r
                  `,children:e.description}),c&&(0,G.jsxs)(`div`,{className:`mt-1.5 flex items-center gap-1`,children:[(0,G.jsx)(`span`,{className:`h-1.5 w-1.5 rounded-full bg-blue-600`}),(0,G.jsx)(`span`,{className:`text-[10px] font-medium text-blue-700`,children:`Current phase`})]})]},e.id)})})]})}var ae={[Z.LOCKED]:{icon:x,iconClass:`text-slate-400`,borderClass:`border-slate-200`,backgroundClass:`bg-slate-50`},[Z.IN_PROGRESS]:{icon:j,iconClass:`text-amber-600`,borderClass:`border-amber-200`,backgroundClass:`bg-amber-50`},[Z.SUBMITTED]:{icon:C,iconClass:`text-amber-600`,borderClass:`border-amber-200`,backgroundClass:`bg-amber-50`},[Z.APPROVED]:{icon:b,iconClass:`text-green-600`,borderClass:`border-green-200`,backgroundClass:`bg-green-50`},[Z.REJECTED]:{icon:te,iconClass:`text-red-600`,borderClass:`border-red-200`,backgroundClass:`bg-red-50`}};function oe(){let{sections:e,activeSection:t,sectionRecordMap:n,progressSummary:r,selectSection:i}=I(),a=[...e].sort((e,t)=>e.order-t.order);return(0,G.jsxs)(`aside`,{className:`\r
        rounded-3xl\r
        border\r
        border-white/20\r
        bg-white/70\r
        backdrop-blur-xl\r
        shadow-lg\r
        p-5\r
      `,children:[(0,G.jsxs)(`div`,{className:`mb-6`,children:[(0,G.jsx)(`h3`,{className:`text-lg font-semibold text-slate-900`,children:`Sections`}),(0,G.jsx)(`p`,{className:`text-sm text-slate-500`,children:`Complete each section in order.`})]}),(0,G.jsxs)(`div`,{className:`mb-5 border-t border-white/20 py-5`,children:[(0,G.jsxs)(`div`,{className:`flex items-center justify-between text-sm`,children:[(0,G.jsx)(`span`,{className:`text-slate-600`,children:`Progress`}),(0,G.jsxs)(`span`,{className:`font-semibold text-blue-700`,children:[r.completedSections,` /`,` `,r.totalSections]})]}),(0,G.jsx)(`div`,{className:`mt-3 h-2 overflow-hidden rounded-full bg-slate-200`,children:(0,G.jsx)(`div`,{className:`h-full rounded-full bg-blue-600 transition-all`,style:{width:`${r.percentage}%`}})})]}),(0,G.jsx)(`div`,{className:`space-y-3`,children:a.map(e=>{let r=n.get(e.id)?.status??Z.LOCKED,a=ae[r],o=a.icon,c=e.id===t.id;return(0,G.jsx)(`button`,{type:`button`,disabled:r===Z.LOCKED,onClick:()=>i(e.id),className:s(`w-full rounded-2xl border p-4 text-left transition-all`,a.borderClass,a.backgroundClass,c&&`ring-2 ring-blue-500 shadow-lg`,`hover:-translate-y-0.5 hover:shadow-md`),children:(0,G.jsxs)(`div`,{className:`flex items-start gap-3`,children:[(0,G.jsx)(`div`,{className:`\r
                    flex\r
                    h-10\r
                    w-10\r
                    shrink-0\r
                    items-center\r
                    justify-center\r
                    rounded-xl\r
                    bg-white\r
                  `,children:(0,G.jsx)(o,{className:s(`h-5 w-5`,a.iconClass)})}),(0,G.jsxs)(`div`,{className:`min-w-0 flex-1`,children:[(0,G.jsx)(`p`,{className:`font-semibold text-slate-900`,children:e.title}),e.description&&(0,G.jsx)(`p`,{className:`mt-1 text-xs text-slate-500`,children:e.description})]})]})},e.id)})})]})}function se(e){return o({queryKey:e?V.sectionComments(e):V.all,queryFn:()=>R.getSectionReviewComments(e),enabled:!!e})}function ce(){let{activeApplicantSection:e}=I(),t=e.status,{data:n=[],isLoading:r,isError:i}=se(e.sectionId);if(t===Z.LOCKED)return null;let o={[Z.SUBMITTED]:{icon:C,title:`Awaiting Review`,description:`Your information has been submitted and is currently waiting to be reviewed by the recruitment team.`,containerClass:`border-amber-200/80 bg-amber-50/70 text-amber-950`,iconContainerClass:`border-amber-200 bg-amber-100 text-amber-600`,badgeClass:`border-amber-200 bg-amber-100 text-amber-700`},[Z.IN_PROGRESS]:{icon:A,title:`Action Required`,description:`This section is currently being worked on. Please review any feedback from the recruitment team and update your information if necessary.`,containerClass:`border-blue-200/80 bg-blue-50/70 text-blue-950`,iconContainerClass:`border-blue-200 bg-blue-100 text-blue-600`,badgeClass:`border-blue-200 bg-blue-100 text-blue-700`},[Z.APPROVED]:{icon:b,title:`Section Approved`,description:`The recruitment team has reviewed and approved this section. No further action is currently required.`,containerClass:`border-emerald-200/80 bg-emerald-50/70 text-emerald-950`,iconContainerClass:`border-emerald-200 bg-emerald-100 text-emerald-600`,badgeClass:`border-emerald-200 bg-emerald-100 text-emerald-700`},[Z.REJECTED]:{icon:D,title:`Changes Requested`,description:`The recruitment team requires changes to the information in this section. Please review the feedback below and update your submission.`,containerClass:`border-red-200/80 bg-red-50/70 text-red-950`,iconContainerClass:`border-red-200 bg-red-100 text-red-600`,badgeClass:`border-red-200 bg-red-100 text-red-700`}}[t];if(!o)return null;let s=o.icon,c=(e,t)=>!e||!t?!1:new Date(t).getTime()>new Date(e).getTime();return(0,G.jsxs)(`div`,{className:`space-y-5`,children:[(0,G.jsx)(`section`,{className:`
          overflow-hidden
          rounded-2xl
          border
          backdrop-blur-sm
          ${o.containerClass}
        `,children:(0,G.jsx)(`div`,{className:`p-5 sm:p-6`,children:(0,G.jsxs)(`div`,{className:`flex gap-4`,children:[(0,G.jsx)(`div`,{className:`
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                ${o.iconContainerClass}
              `,children:(0,G.jsx)(s,{className:`h-5 w-5`})}),(0,G.jsxs)(`div`,{className:`min-w-0 flex-1`,children:[(0,G.jsxs)(`div`,{className:`flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between`,children:[(0,G.jsx)(`h3`,{className:`text-base font-semibold sm:text-lg`,children:o.title}),(0,G.jsx)(`span`,{className:`
                    w-fit
                    rounded-full
                    border
                    px-2.5
                    py-1
                    text-xs
                    font-medium
                    ${o.badgeClass}
                  `,children:t.replace(`_`,` `)})]}),(0,G.jsx)(`p`,{className:`mt-2 text-sm leading-6 opacity-80`,children:o.description}),t===Z.APPROVED&&e.approvedAt&&(0,G.jsxs)(`div`,{className:`mt-4 flex items-center gap-2 text-xs opacity-70`,children:[(0,G.jsx)(b,{className:`h-4 w-4`}),(0,G.jsxs)(`span`,{children:[`Approved on`,` `,new Date(e.approvedAt).toLocaleString()]})]})]})]})})}),(0,G.jsxs)(`section`,{className:`\r
          overflow-hidden\r
          rounded-2xl\r
          border\r
          border-slate-200/80\r
          bg-white/70\r
          shadow-sm\r
          backdrop-blur-xl\r
        `,children:[(0,G.jsxs)(`div`,{className:`\r
            flex\r
            items-center\r
            justify-between\r
            gap-4\r
            border-b\r
            border-slate-200/70\r
            px-5\r
            py-4\r
            sm:px-6\r
          `,children:[(0,G.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,G.jsx)(`div`,{className:`\r
                flex\r
                h-10\r
                w-10\r
                items-center\r
                justify-center\r
                rounded-xl\r
                bg-blue-50\r
                text-blue-600\r
              `,children:(0,G.jsx)(M,{className:`h-5 w-5`})}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`h3`,{className:`text-sm font-semibold text-slate-900 sm:text-base`,children:`Recruitment Feedback`}),(0,G.jsx)(`p`,{className:`mt-0.5 text-xs text-slate-500`,children:`Messages and updates from the recruitment team.`})]})]}),!r&&n.length>0&&(0,G.jsxs)(`span`,{className:`\r
                rounded-full\r
                bg-slate-100\r
                px-2.5\r
                py-1\r
                text-xs\r
                font-medium\r
                text-slate-600\r
              `,children:[n.length,` `,n.length===1?`comment`:`comments`]})]}),r&&(0,G.jsxs)(`div`,{className:`flex items-center justify-center gap-3 px-5 py-10`,children:[(0,G.jsx)(a,{className:`h-5 w-5 animate-spin text-blue-600`}),(0,G.jsx)(`span`,{className:`text-sm text-slate-500`,children:`Loading recruitment feedback...`})]}),!r&&i&&(0,G.jsxs)(`div`,{className:`px-5 py-8 text-center sm:px-6`,children:[(0,G.jsx)(D,{className:`mx-auto h-8 w-8 text-red-400`}),(0,G.jsx)(`p`,{className:`mt-3 text-sm font-medium text-slate-700`,children:`Unable to load recruitment feedback.`}),(0,G.jsx)(`p`,{className:`mt-1 text-xs text-slate-500`,children:`Please try again later.`})]}),!r&&!i&&n.length===0&&(0,G.jsxs)(`div`,{className:`px-5 py-10 text-center sm:px-6`,children:[(0,G.jsx)(`div`,{className:`\r
                mx-auto\r
                flex\r
                h-12\r
                w-12\r
                items-center\r
                justify-center\r
                rounded-2xl\r
                bg-slate-50\r
                text-slate-400\r
              `,children:(0,G.jsx)(M,{className:`h-6 w-6`})}),(0,G.jsx)(`p`,{className:`mt-4 text-sm font-medium text-slate-700`,children:`No feedback yet`}),(0,G.jsx)(`p`,{className:`mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500`,children:`Any comments or feedback from the recruitment team will appear here.`})]}),!r&&!i&&n.length>0&&(0,G.jsx)(`div`,{className:`divide-y divide-slate-100`,children:n.map((e,t)=>{if(!e)return null;let n=c(e.createdAt,e.updatedAt);return(0,G.jsx)(`article`,{className:`\r
                    relative\r
                    px-5\r
                    py-5\r
                    transition-colors\r
                    hover:bg-slate-50/70\r
                    sm:px-6\r
                  `,children:(0,G.jsxs)(`div`,{className:`flex gap-4`,children:[(0,G.jsx)(`div`,{className:`\r
                        flex\r
                        h-9\r
                        w-9\r
                        shrink-0\r
                        items-center\r
                        justify-center\r
                        rounded-full\r
                        bg-blue-50\r
                        text-xs\r
                        font-semibold\r
                        text-blue-600\r
                      `,children:t+1}),(0,G.jsxs)(`div`,{className:`min-w-0 flex-1`,children:[(0,G.jsxs)(`div`,{className:`flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between`,children:[(0,G.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,G.jsx)(`p`,{className:`text-sm font-semibold text-slate-800`,children:`Recruitment Team`}),n&&(0,G.jsxs)(`span`,{className:`flex items-center gap-1 text-xs text-slate-400`,children:[(0,G.jsx)(N,{className:`h-3 w-3`}),`Edited`]})]}),(0,G.jsx)(`time`,{className:`text-xs text-slate-400`,children:new Date(e.createdAt).toLocaleString()})]}),(0,G.jsx)(`div`,{className:`\r
                          mt-3\r
                          rounded-xl\r
                          border\r
                          border-slate-100\r
                          bg-slate-50/80\r
                          p-4\r
                        `,children:(0,G.jsx)(`p`,{className:`whitespace-pre-wrap text-sm leading-6 text-slate-600`,children:e.comment})})]})]})},e.id)})})]})]})}function le(){return d()}function $(e){let t={};return e.forEach(e=>{if(e.name)switch(e.type){case`checkbox`:t[e.name]=!1;break;case`file`:case`signature`:t[e.name]=null;break;default:t[e.name]=``}}),t}function ue({section:e}){let{control:t}=le(),{fields:n,append:r,remove:i}=p({control:t,name:e.id}),a=e.minItems??1,o=e.maxItems??2**53-1;return(0,G.jsxs)(`div`,{className:`space-y-6`,children:[n.map((t,r)=>(0,G.jsxs)(`div`,{className:`\r
            rounded-2xl\r
            border\r
            border-slate-200\r
            bg-white/50\r
            p-6\r
          `,children:[(0,G.jsxs)(`div`,{className:`mb-6 flex items-center justify-between`,children:[(0,G.jsxs)(`h3`,{className:`font-medium text-slate-800`,children:[e.title,` #`,r+1]}),n.length>a&&(0,G.jsx)(`button`,{type:`button`,onClick:()=>i(r),className:`\r
                  rounded-lg\r
                  p-2\r
                  text-red-500\r
                  transition\r
                  hover:bg-red-50\r
                `,children:(0,G.jsx)(h,{size:18})})]}),(0,G.jsx)(E,{fields:e.fields,prefix:`${e.id}.${r}`,config:{mode:`edit`,readOnly:!1}})]},t.id)),n.length<o&&(0,G.jsxs)(`button`,{type:`button`,onClick:()=>r($(e.fields)),className:`\r
            flex\r
            items-center\r
            gap-2\r
            rounded-xl\r
            border\r
            border-dashed\r
            border-blue-300\r
            bg-blue-50/60\r
            px-5\r
            py-3\r
            text-sm\r
            font-medium\r
            text-blue-700\r
            transition\r
            hover:bg-blue-100\r
          `,children:[(0,G.jsx)(w,{size:18}),`Add another `,e.title]})]})}function de(){let{activeSection:e}=I();return e.fields.length?e.repeatable?(0,G.jsx)(ue,{section:e}):(0,G.jsx)(E,{fields:e.fields,config:{mode:`edit`,readOnly:!1}}):(0,G.jsx)(`div`,{className:`\r
          rounded-3xl\r
          border\r
          border-dashed\r
          border-slate-300\r
          bg-white/10\r
          p-10\r
          text-center\r
        `,children:(0,G.jsx)(`p`,{className:`text-slate-500`,children:`This section doesn't contain any fields yet.`})})}function fe(e){return o({queryKey:[`application`,`section`,e],queryFn:()=>H.getApplicantSection(e),enabled:!!e})}function pe({children:e}){let{activeSection:t}=I(),n=(0,P.useMemo)(()=>t.fields??[],[t.fields]),r=(0,P.useMemo)(()=>m({fields:n,repeatable:t.repeatable,sectionId:t.repeatable?t.id:void 0}),[n,t.repeatable,t.id]),i=(0,P.useMemo)(()=>v(n),[n]),{data:a}=fe(t.id),o=l({resolver:g(r),mode:`onBlur`,reValidateMode:`onChange`,defaultValues:i}),{reset:s}=o;return(0,P.useEffect)(()=>{if(t.repeatable){let e=Array.isArray(a?.values)?a.values:[];s({[t.id]:e.length>0?e:i[t.id]});return}let e=!Array.isArray(a?.values)&&a?.values&&Object.keys(a.values).length>0?a.values:i;s(e)},[t.id,t.repeatable,a?.values,i,s]),(0,G.jsx)(f,{...o,children:e})}function me(){return(0,G.jsx)(re,{children:(0,G.jsxs)(`div`,{className:`space-y-8`,children:[(0,G.jsx)(q,{}),(0,G.jsx)(ie,{}),(0,G.jsxs)(`div`,{className:`grid gap-8 lg:grid-cols-[300px_1fr]`,children:[(0,G.jsx)(oe,{}),(0,G.jsxs)(`div`,{className:`space-y-6   \r
        rounded-3xl\r
        border\r
        border-white/20\r
        bg-white/70\r
        backdrop-blur-xl\r
        shadow-lg\r
        p-5\r
      `,children:[(0,G.jsx)(ce,{}),(0,G.jsxs)(pe,{children:[(0,G.jsx)(de,{}),(0,G.jsx)(K,{})]})]})]})]})})}export{me as default};