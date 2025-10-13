// ...existing code...
type Env = 'Prod' | 'QA' | 'Dev';

let EnvUsing: Env = 'QA'; // can be changed at runtime: 'Prod' | 'QA' | 'Dev'
const IsPrefix = false;

const HostProd = 'www.semdcp.com';
const HostQa = 'dcpqa.semdcp.com';
const HostDev = 'dcpdev.semdcp.com';

const SSOHostProd = 'fedlogin.cat.com';
const SSOHostQa = 'loginmcqa.rd.cat.com';
const SSOHostDev = 'loginmcqa.rd.cat.com';

const HostMap: Record<Env, string> = {
  Prod: HostProd,
  QA: HostQa,
  Dev: HostDev,
};
const SSOHostMap: Record<Env, string> = {
  Prod: SSOHostProd,
  QA: SSOHostQa,
  Dev: SSOHostDev,
};

const Host = HostMap[EnvUsing];
const SSOHost = SSOHostMap[EnvUsing];

export const Consts = {
  Config: {
    EnvUsing,
    IsPrefix,
    Host,
    SSOHost,
    HostProd,
    HostQa,
    HostDev,
    // LoginUrl used by mobile to start SSO/B2C flow
    LoginUrl: `https://${Host}/Login/getentralogin?isFromMobile=true`,
    LogoutUrl: `https://${Host}/Login/getentralogin?isFromMobile=true`,
    CallbackUrl: `https://${Host}/oauth_redirect/Callback?`,
    LearnmoreUrl: 'https://www.semmachinery.com/',
    BaseUrl: `https://${Host}/api`,
    BaseH5Url: EnvUsing.includes('Dev')  ? (IsPrefix ? `https://${Host}/DCP_Web/ECPrefix/#` : `https://${Host}/DCP_Web/EC/#`) : `https://${Host}/ecservice/#`,
    H5LoadingQuery: '/#/?clientId={loginName}&userType={userType}&secret={token}',
    KeyDomain: Host,
    KeyPath: EnvUsing.includes('Dev') ? '/DCP_Web/EC/' : '/ecservice/',
    AuthToken: 'Abp.AuthToken',
    EncAuthToken: 'enc_auth_token',
    EShopUrl: EnvUsing.includes('Prod') ? 'https://shop107383496.m.youzan.com/wscshop/showcase/homepage?kdt_id=107191328' : 'https://shop106394878.m.youzan.com/wscshop/showcase/homepage?kdt_id=106202710',
  },
};

// Named export; import with: import { Consts } from '../constants/config'
export default Consts;