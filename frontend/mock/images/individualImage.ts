import fetch from 'isomorphic-unfetch';
import {Request} from 'express';

const images = [
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1582885214651&di=77163884e9a374391b4302d8bdd4fa1d&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F50124b1944e8887b95154598f8b5212886ddf03641f19-GbcSBV_fw658',
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1582889403799&di=bb4db115c1227e081852bbb95336150b&imgtype=0&src=http%3A%2F%2Fres.hpoi.net.cn%2Fgk%2Fcover%2Fn%2F2015%2F02%2Fff897b88ccd5417f91d4159a8ea343a6.jpg%3Fdate%3D1464606291000',
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1582889975692&di=cd91e6c70d07ef496bfcca20597eb5af&imgtype=0&src=http%3A%2F%2Fimg3.duitang.com%2Fuploads%2Fitem%2F201411%2F28%2F20141128211355_HPfYT.thumb.224_0.gif',
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1582890006236&di=9f030009422b91e8753f8c476426fc39&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201812%2F22%2F20181222172346_ykcdh.thumb.224_0.gif',
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1582890018944&di=d79e0ce4cef39f0ef81cb38c440ca858&imgtype=0&src=http%3A%2F%2Fgss3.bdstatic.com%2F7Po3dSag_xI4khGkpoWK1HF6hhy%2Fbaike%2Fw%3D150%2Fsign%3D074ebdb2367adab43dd01f46bbd5b36b%2F42166d224f4a20a4b974325d90529822730ed0c6.jpg'
];

export default async (query: Request['query']) => {
    const index = (query.index ?? 0) % images.length;
    const res = await fetch(images[index]);
    return res.arrayBuffer();
};
