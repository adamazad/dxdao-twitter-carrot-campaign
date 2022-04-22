const axios = require('axios')

const usernames = `
vitalikbuterin
tayvano
0xMaki
monetsupply
danrobinson
NeerajKA
DegenSpartan
QwQiao
RyanSAdams
StaniKulechov
rleshner
fintechfrank
defipulse
kaiynne
jchervinsky
zhusu
samczsun
santiagoroel
chaserchapman
shegenerates
peter_szilagyi
n2ckchong
0xtuba
Mudit__Gupta
reshmasaujani
lemiscate
hudsonjameson
timbeiko
gakonst
matthuang
transmissions11
evabeylin
anishagnihotri
fomosaurus
kaiynne
econoar
CamiRusso
DegenSpartan
DeFi_Dad
sassal0x
Arthur_0x
RAC
hosseeb
mariashen
kylesamani
spencernoon
iandaos
sergeynazarov
hasufl
ethereumJoseph`
  .split('\n')
  .filter(Boolean)
  .map((username) => username.trim())

Promise.all(
  usernames.map((username) => {
    return axios
      .get(`https://api.twitter.com/2/users/by/username/${username}`, {
        headers: {
          Authorization:
            'Bearer AAAAAAAAAAAAAAAAAAAAAA%2F9bQEAAAAAlBLj%2Fu0yobzG1UnTZdWvc8%2BdNnI%3DO3CsPbGE7Y7OeT90b4RTTV3LxAfG6dkg5snU7KuSge1b4KTvWZ',
          'x-rate-limit-reset': '',
        },
      })
      .then((res) => {
        return {
          username,
          id: res.data.data.id,
        }
      })
      .catch((err) => {
        console.log(err.response)
      })
  })
).then((ids) => {
  console.log(ids)
})
