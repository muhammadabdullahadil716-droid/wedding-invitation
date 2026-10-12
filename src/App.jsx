import { useEffect, useMemo, useRef, useState } from 'react'

/* Always start from the top on refresh */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
if (location.hash) history.replaceState(null, '', location.pathname + location.search)
window.scrollTo(0, 0)

/* Fiza Adil & Hamza — wedding invitation (React, frontend only) */
const WA = '923007979098'
const MAPS = 'https://maps.app.goo.gl/EVUujyVZcSp6fQEH6'
const TARGET = new Date(2026, 10, 24, 20, 0, 0) // Mehndi: 24 Nov 2026, 8 PM (local time)
const MAPS_BARAT = 'https://maps.app.goo.gl/7frxXWYrPhYqD89i9'
const EMAIL = 'abdullahattari451@gmail.com' // RSVP replies are emailed here (via formsubmit.co)
const CONTACTS = [['0300 7979098', '923007979098'], ['0325 5203908', '923255203908'], ['0313 1458317', '923131458317']]
const START = 18 // song starts from the 18th second
const IMG = '/assets/images/'
const glyphs = ['❀', '✿', '❁', '✾']
const tones = ['#e7b9b0', '#b98f3e', '#8a9870', '#f0d9cf']
const rnd = (a, b) => a + Math.random() * (b - a)
const pad = (n) => String(n).padStart(2, '0')
const chain = (...files) => (e) => { const img = e.currentTarget; const i = Number(img.dataset.i || 0) + 1; if (i < files.length) { img.dataset.i = i; img.src = IMG + files[i] } }

/* ---------- Scratch card ---------- */
function Scratch() {
  const box = useRef(null), cv = useRef(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const c = cv.current, b = box.current, ctx = c.getContext('2d', { willReadFrequently: true })
    let drawing = false, finished = false, last = null
    const paint = () => {
      const r = b.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2)
      c.width = r.width * dpr; c.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const g = ctx.createLinearGradient(0, 0, r.width, r.height)
      g.addColorStop(0, '#e2c57a'); g.addColorStop(.5, '#b98f3e'); g.addColorStop(1, '#e9d08f')
      ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = g; ctx.fillRect(0, 0, r.width, r.height)
      ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.5; ctx.strokeRect(10, 10, r.width - 20, r.height - 20)
      ctx.fillStyle = '#fff8e6'; ctx.textAlign = 'center'; ctx.font = `600 ${Math.round(r.width / 12)}px "Playfair Display", Georgia, serif`
      ctx.fillText('Scratch here', r.width / 2, r.height / 2 + 6)
      ctx.font = `${Math.round(r.width / 22)}px Georgia, serif`; ctx.fillText('✦  ✦  ✦', r.width / 2, r.height / 2 + r.width / 10)
    }
    const pos = (e) => { const r = c.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } }
    const scratch = (e) => {
      const p = pos(e); ctx.globalCompositeOperation = 'destination-out'; ctx.lineCap = ctx.lineJoin = 'round'; ctx.lineWidth = 38
      ctx.beginPath(); ctx.moveTo((last || p).x, (last || p).y); ctx.lineTo(p.x, p.y); ctx.stroke(); last = p
    }
    const check = () => {
      const d = ctx.getImageData(0, 0, c.width, c.height).data; let clear = 0, n = 0
      for (let i = 3; i < d.length; i += 160) { n++; if (d[i] === 0) clear++ }
      if (clear / n > 0.5) { finished = true; setDone(true) }
    }
    const down = (e) => { if (finished) return; drawing = true; last = null; c.setPointerCapture(e.pointerId); scratch(e) }
    const move = (e) => { if (drawing && !finished) scratch(e) }
    const end = () => { if (!drawing) return; drawing = false; last = null; check() }
    let w0 = window.innerWidth
    const resize = () => { if (!finished && window.innerWidth !== w0) { w0 = window.innerWidth; paint() } }
    c.addEventListener('pointerdown', down); c.addEventListener('pointermove', move)
    c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end); window.addEventListener('resize', resize)
    ;(document.fonts ? document.fonts.ready : Promise.resolve()).then(paint)
    return () => {
      c.removeEventListener('pointerdown', down); c.removeEventListener('pointermove', move)
      c.removeEventListener('pointerup', end); c.removeEventListener('pointercancel', end); window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <>
      <div className="scratch rv" ref={box}>
        <div className="scratch-msg">
          <p className="arabic sm">وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا</p>
          <p className="script big">Join us for the Nikah &amp; celebrations</p>
          <p>Your presence and duas will make our joy complete.<br />🪔 Mehndi 24 Nov · 🎆 Barat 25 Nov 2026</p>
        </div>
        <canvas ref={cv} className={done ? 'gone' : ''} id="scratchCanvas" aria-label="Scratch card" />
      </div>
      <p className="hint">{done ? 'Revealed — see you at the celebrations!' : 'Drag your finger or mouse over the card'}</p>
    </>
  )
}

/* ---------- Countdown ---------- */
function Countdown() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])
  const s = Math.max(0, Math.floor((TARGET - now) / 1000))
  const parts = [['Days', Math.floor(s / 86400)], ['Hours', Math.floor((s % 86400) / 3600)], ['Minutes', Math.floor((s % 3600) / 60)], ['Seconds', s % 60]]
  return (
    <>
      <div className="count rv">
        {parts.map(([label, v]) => (
          <div key={label}><b key={pad(v)} className="tick">{pad(v)}</b><span>{label}</span></div>
        ))}
      </div>
      <p className="lead rv">{s === 0 ? 'The celebrations have begun!' : '💃 until the Mehndi · 24 November 2026, 8:00 PM'}</p>
    </>
  )
}

/* ---------- RSVP: reply is emailed to the family via formsubmit.co (no server of our own) ---------- */
function Rsvp() {
    const saved = (() => { try { return JSON.parse(localStorage.getItem('rsvp-done')) } catch { return null } })()
    const [f, setF] = useState(saved?.f || { name: '', phone: '', attend: "Yes, I'll be there", msg: '' })
  const [bad, setBad] = useState({})
    const [st, setSt] = useState(saved?.st || 'idle') // idle | sending | ok | fail
  const [sent, setSent] = useState(!!saved)
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setBad({ ...bad, [k]: false }) }
  const yes = f.attend.startsWith('Yes')
    useEffect(() => { if (sent && st !== 'sending') { try { localStorage.setItem('rsvp-done', JSON.stringify({ f, st })) } catch {} } }, [sent, st])

  const submit = async (e) => {
    e.preventDefault()
    const b = { name: f.name.trim().length < 2, phone: f.phone.replace(/\D/g, '').length < 10 }
    setBad(b)
    if (b.name || b.phone || st === 'sending') return
    setSt('sending')
    try {
      const r = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ _subject: `RSVP: ${f.name} - ${yes ? 'Attending' : 'Not attending'}`, _template: 'table', _captcha: 'false', Name: f.name, Phone: f.phone, Reply: f.attend, Message: f.msg || '-' }),
      })
      const d = await r.json().catch(() => ({}))
      setSt(r.ok && String(d.success) !== 'false' ? 'ok' : 'fail')
    } catch { setSt('fail') }
    setSent(true)
  }
  const text = `Assalam o Alaikum! RSVP for Fiza (Bride) & Hamza (Groom)\nName: ${f.name}\nPhone: ${f.phone}\nReply: ${f.attend}` + (f.msg.trim() ? `\nMessage: ${f.msg.trim()}` : '')

  if (sent) return (
    <div className="card done">
      <svg viewBox="0 0 52 52" width="72" height="72"><circle cx="26" cy="26" r="24" fill="none" stroke="#b98f3e" strokeWidth="2" /><path d="M15 27l8 8 14-16" fill="none" stroke="#56623f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <h3>{yes ? `JazakAllah Khair, ${f.name}! 🎉` : `We will miss you, ${f.name}`}</h3>
      <p>{yes ? 'We are delighted that you will join us. See you at the Mehndi (24 Nov, 8:00 PM) and the Barat (25 Nov, 5:00 PM), in shaa Allah.' : 'Your duas and good wishes mean the world to us. May Allah bless you. 🤲'}</p>
            {st === 'ok' ? (
        <>
          <p className="fine">Your message has been sent successfully. Thank you!</p>
          
          <a className="btn" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${CONTACTS[0][1]}`}>For more details message us onWhatsApp</a>
        </>
      ) : (
        <>
          <p className="fine">Email could not be sent right now. Please send your reply on WhatsApp below.</p>
          <a className="btn" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${CONTACTS[0][1]}?text=${encodeURIComponent(text)}`}>Send reply on WhatsApp</a>
        </>
      )}
    </div>
  )
  return (
    <form className="card form rv" onSubmit={submit} noValidate>
      <label>Guest name<input className={bad.name ? 'bad' : ''} value={f.name} onChange={set('name')} autoComplete="name" placeholder="Your full name" /></label>
      <label>Phone number<input className={bad.phone ? 'bad' : ''} type="tel" inputMode="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" placeholder="03XX XXXXXXX" /></label>
      <fieldset>
        <legend>Will you attend?</legend>
        {["Yes, I'll be there", "Sorry, I can't attend"].map((o) => (
          <label className="opt" key={o}><input type="radio" name="attend" checked={f.attend === o} onChange={() => setF({ ...f, attend: o })} /><span>{o}</span></label>
        ))}
      </fieldset>
      <label>Message (optional)<textarea rows="3" value={f.msg} onChange={set('msg')} placeholder="Your duas for the couple" /></label>
      <button className="btn submit" type="submit" disabled={st === 'sending'}>{st === 'sending' ? 'Sending…' : 'Send RSVP'}</button>
      <p className="fine">Your reply is emailed to the family.</p>
    </form>
  )
}

/* ---------- App ---------- */
export default function App() {
  const [open, setOpen] = useState(false)
  const [gone, setGone] = useState(false)
  const [music, setMusic] = useState(false)
  const [toast, setToast] = useState('')
  const [active, setActive] = useState('home')
  const [wa, setWa] = useState(false)     // WhatsApp / call popup
  const [sel, setSel] = useState(null)    // selected number in popup
  const [auto, setAuto] = useState(false) // auto scroll
  const audio = useRef(null), floaters = useRef(null)

  const petals = useMemo(() => Array.from({ length: 14 }, () => ({ g: glyphs[(Math.random() * 4) | 0], c: tones[(Math.random() * 4) | 0], left: rnd(0, 100) + '%', fontSize: rnd(14, 26), animationDuration: rnd(9, 18) + 's', animationDelay: -rnd(0, 14) + 's' })), [])
  const flowers = useMemo(() => Array.from({ length: 8 }, (_, i) => ({ g: glyphs[i % 4], c: tones[i % 4], left: (i % 2 ? rnd(80, 94) : rnd(2, 14)) + '%', top: rnd(6, 88) + '%', fontSize: rnd(26, 46), animationDelay: -rnd(0, 6) + 's', animationDuration: rnd(5, 9) + 's', speed: rnd(0.03, 0.09) })), [])

  const say = (m) => { setToast(m); clearTimeout(say.t); say.t = setTimeout(() => setToast(''), 3200) }
  const play = async () => {
    const a = audio.current
    try {
      if (a.readyState >= 1) { if (a.currentTime < START) a.currentTime = START }
      else a.addEventListener('loadedmetadata', () => { a.currentTime = START }, { once: true })
      await a.play(); setMusic(true)
    } catch { setMusic(false); say('Add your song as public/assets/audio/song.mp3 to play music') }
  }
  const toggleMusic = () => (audio.current.paused ? play() : (audio.current.pause(), setMusic(false)))
  const openInvite = () => {
    if (open) return
    setOpen(true); play()
    setTimeout(() => setGone(true), 1700)
  }

  useEffect(() => { document.body.classList.toggle('locked', !gone) }, [gone])
  useEffect(() => {
    const a = audio.current; a.volume = 0.6
    const again = () => { a.currentTime = START; a.play().catch(() => {}) }
    a.addEventListener('ended', again)
    return () => a.removeEventListener('ended', again)
  }, [])
  useEffect(() => { document.documentElement.dataset.theme = 'light' }, [])

  useEffect(() => { // auto scroll (stops on touch / wheel / key / bottom)
    if (!auto) return
    let raf, last = performance.now(), acc = 0
    const evs = ['wheel', 'touchstart', 'keydown']
    const stop = (e) => { if (!e.target?.closest?.('.autoscroll')) setAuto(false) }
    const step = (t) => {
      acc += (t - last) * 0.07; last = t
      const n = Math.floor(acc)
      if (n > 0) { window.scrollBy({ top: n, behavior: 'instant' }); acc -= n }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) { setAuto(false); return }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    evs.forEach((ev) => window.addEventListener(ev, stop, { passive: true }))
    return () => { cancelAnimationFrame(raf); evs.forEach((ev) => window.removeEventListener(ev, stop)) }
  }, [auto])

  useEffect(() => { // close contact popup on outside tap / Escape
    if (!wa) return
    const out = (e) => { if (!e.target.closest('.wa-menu, .wa-float')) setWa(false) }
    const esc = (e) => e.key === 'Escape' && setWa(false)
    document.addEventListener('pointerdown', out); document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', out); document.removeEventListener('keydown', esc) }
  }, [wa])

  useEffect(() => { // scroll reveal + nav highlight
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.15 })
    document.querySelectorAll('.rv').forEach((el) => io.observe(el))
    const so = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { threshold: 0.45 })
    document.querySelectorAll('main section[id]').forEach((s) => so.observe(s))
    return () => { io.disconnect(); so.disconnect() }
  }, [])

  useEffect(() => { // gentle parallax
    let t = false
    const on = () => {
      if (t) return; t = true
      requestAnimationFrame(() => { floaters.current?.querySelectorAll('.fl').forEach((f) => { f.style.translate = `0 ${-window.scrollY * f.dataset.speed}px` }); t = false })
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <>
      {/* Closed envelope */}
      <div id="intro" className={`${open ? 'open' : ''} ${gone ? 'gone' : ''}`} role="button" tabIndex={0} aria-label="Tap to open the invitation"
        onClick={openInvite} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), openInvite())}>
        <div className="petals" aria-hidden="true">
          {petals.map((p, i) => <span key={i} className="petal" style={{ left: p.left, fontSize: p.fontSize, color: p.c, animationDuration: p.animationDuration, animationDelay: p.animationDelay }}>{p.g}</span>)}
        </div>
        <p className="intro-top">You are cordially invited</p>
        <div className="envelope">
          <div className="env-card"><span className="script">Fiza &amp; Hamza</span><small>Wedding Invitation</small></div>
          <div className="env-back" /><div className="env-flap" /><div className="env-front" />
          <div className="seal">F<i>&amp;</i>H</div>
        </div>
        <p className="intro-hint">Tap the envelope to open</p>
      </div>

      <button className={`autoscroll ${auto ? 'on' : ''}`} onClick={() => setAuto(!auto)} aria-pressed={auto} title="Auto scroll">
        <span aria-hidden="true">{auto ? '⏸' : '⬇'}</span><b>{auto ? 'Stop' : 'Auto scroll'}</b>
      </button>
      <button className={`music ${music ? 'on' : ''}`} onClick={toggleMusic} aria-pressed={music} title="Music">
        <span className="eq"><i /><i /><i /></span><b>{music ? 'Music On' : 'Music Off'}</b>
      </button>
      <button className="wa-float" onClick={() => { setWa(!wa); setSel(null) }} aria-label="Contact on WhatsApp or call" aria-expanded={wa}>
        <svg viewBox="0 0 32 32" width="28" height="28" fill="#fff"><path d="M16 3a13 13 0 0 0-11 19.8L3 29l6.400-2A13 13 0 1 0 16 3zm0 2.400a10.600 10.600 0 1 1-5.600 19.600l-.4-.2-3.800 1.200 1.200-3.700-.3-.4A10.600 10.600 0 0 1 16 5.400zm-4 5.200c-.3 0-.7.100-1 .5-.4.400-1.300 1.300-1.300 3.100s1.300 3.600 1.500 3.900c.2.200 2.600 4.100 6.400 5.600 3.100 1.200 3.800 1 4.400.9.700-.1 2.200-.9 2.500-1.800.3-.9.3-1.600.2-1.800-.1-.2-.3-.3-.7-.5l-2.300-1.100c-.3-.1-.5-.2-.8.200l-1 1.200c-.2.300-.4.300-.8.100-.4-.2-1.500-.6-2.900-1.800-1.100-1-1.800-2.200-2-2.500-.2-.4 0-.6.200-.8l.6-.7c.2-.2.200-.4.400-.6.100-.3.100-.5 0-.7l-1-2.400c-.2-.5-.5-.5-.7-.5z" /></svg>
      </button>
      {wa && (
        <div className="wa-menu" role="dialog" aria-label="Contact numbers">
          <p className="clabel">Choose a number</p>
          {CONTACTS.map(([n, i], k) => (
            <div key={n}>
              <button type="button" className={`wa-num ${sel === k ? 'sel' : ''}`} onClick={() => setSel(sel === k ? null : k)}>📞 {n}</button>
              {sel === k && (
                <div className="wa-acts">
                  <a className="btn wa" href={`https://wa.me/${i}?text=Assalam%20o%20Alaikum!`} target="_blank" rel="noopener noreferrer" onClick={() => setWa(false)}>WhatsApp</a>
                  <a className="btn" href={`tel:+${i}`} onClick={() => setWa(false)}>Call</a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <nav className="nav" aria-label="Sections">
        {[['home', 'Home'], ['invite', 'Invitation'], ['events', 'Events'], ['countdown', 'Countdown'], ['location', 'Location'], ['rsvp', 'RSVP']].map(([id, tip]) => (
          <a key={id} href={`#${id}`} data-tip={tip} className={active === id ? 'active' : ''} />
        ))}
      </nav>

      <main>
        <section id="home" className="hero">
          <div className="floaters" ref={floaters} aria-hidden="true">
            {flowers.map((f, i) => <span key={i} className="fl" data-speed={f.speed} style={{ left: f.left, top: f.top, fontSize: f.fontSize, color: f.c, animationDelay: f.animationDelay, animationDuration: f.animationDuration }}>{f.g}</span>)}
          </div>
          <div className="frame rv">
            <p className="arabic">بِسْمِ ٱللّٰهِ ٱلرَّحْمٰنِ ٱلرَّحِيمِ</p>
            <p className="small">With the blessings of Allah, we joyfully invite you to the wedding of</p>
            <h1 className="names"><span className="script"><small className="role">Bride</small>Fiza </span><em>&amp;</em><span className="script"><small className="role">Groom</small>Hamza</span></h1>
            <div className="parents">
              <p><small>Daughter of</small><br />Mr &amp; Mrs<br />Muhammad Ramzan Adil</p>
              <p><small>Son of</small><br />Mr &amp; Mrs<br />Muhammad Haneef</p>
            </div>
            <span className="scroll-cue" aria-hidden="true" />
          </div>
        </section>

        <section id="invite" className="sec">
          <h2 className="script rv">A little surprise</h2>
          <p className="lead rv">Scratch the golden card to reveal your invitation</p>
          <Scratch />
        </section>

        <section className="sec std">
          <div className="ring r1" aria-hidden="true" /><div className="ring r2" aria-hidden="true" />
          {[['10%', '18%'], ['86%', '24%'], ['16%', '78%'], ['82%', '84%']].map(([l, t], i) => <i key={i} className="spk" style={{ left: l, top: t, animationDelay: `${i * 0.6}s` }}>✦</i>)}
          <p className="small rv">Save the date</p>
          <h2 className="bigdate rv"><span>25</span><em>November</em><span>2026</span></h2>
          <p className="small rv sub">🎆 Barat</p>
          {/* <p className="script rv">Fiza (Bride) &amp; Hamza (Groom)</p> */}
        </section>

        <section className="sec couple">
          <div className="art rv">
            <img className="duo" src={`${IMG}couple.jpg`} onError={chain('couple.jpg', 'couple.png', 'couple.svg')} alt="Bride and groom illustration" />
            <i className="h h1">❤</i><i className="h h2">❤</i><i className="h h3">❤</i>
          </div>
          <h2 className="script rv">Fiza ❤ Hamza</h2>
          <p className="small rv">Fiza, the Bride · Hamza, the Groom</p>
          <p className="lead rv">Two hearts, one beautiful beginning.</p>
        </section>

        <section id="events" className="sec">
          <h2 className="script rv">Wedding Events</h2>
          <div className="timeline">
            <article className="card ev mehndi rv">
              <div className="emo" aria-hidden="true"><span>🪔</span><span>🥁</span><span>💃</span></div>
              <h3>Mehndi</h3>
              <p className="tag">Mehndi Thal · Dholki · Girls&apos; Dance</p>
              <p className="when">24 November 2026 · 8:00 PM</p>
              <p>Jameel Town, Street No. 02,<br />Near Shahbaz Sharif Park,<br />GM Abad</p>
              <a className="btn" href={MAPS} target="_blank" rel="noopener noreferrer">View Location</a>
            </article>
            <article className="card ev barat rv">
              <div className="emo" aria-hidden="true"><span>🪘</span><span>🕺</span><span>🎆</span></div>
              <h3>Barat</h3>
              <p className="tag">Dhol · Bhangra · Atish Bazi</p>
              <p className="when">25 November 2026 · 5:00 PM</p>
              <p>New Taj Mehal Marquee,<br />Samanabad Pull Service Road,<br />Faisalabad</p>
              <a className="btn" href={MAPS_BARAT} target="_blank" rel="noopener noreferrer">View Location</a>
            </article>
          </div>
        </section>

        <section id="countdown" className="sec">
          <h2 className="script rv">Counting the moments</h2>
          <Countdown />
        </section>

        <section id="location" className="sec">
          <h2 className="script rv">Venues</h2>
          <div className="timeline">
            {[
              { k: 'mehndi', t: '🪔 Mehndi Venue', w: '24 Nov · 8:00 PM', a: ['Jameel Town, Street No. 02,', 'near Shahbaz Sharif Park, GM Abad'], u: MAPS },
              { k: 'barat', t: '🪘 Barat Venue', w: '25 Nov · 5:00 PM', a: ['New Taj Mehal Marquee,', 'Samanabad Pull Service Road, Faisalabad'], u: MAPS_BARAT },
            ].map((v) => (
              <div key={v.k} className={`card rv loc ev ${v.k}`}>
                <div className="pin" aria-hidden="true">📍</div>
                <h3>{v.t}</h3>
                <p className="when">{v.w}</p>
                <p>{v.a[0]}<br />{v.a[1]}</p>
                <a className="btn" href={v.u} target="_blank" rel="noopener noreferrer">Get Directions</a>
              </div>
            ))}
          </div>
        </section>

        <section id="rsvp" className="sec">
          <h2 className="script rv">Kindly Reply</h2>
          <Rsvp />
        </section>

      </main>

      <footer className="foot">
        <p className="arabic sm">بَارَكَ اللّٰهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا</p>
        <div className="hosts rv">
          <p className="comp">With best compliments of</p>
          <p>Mr &amp; Mrs Shah Muhammad</p>
          <p>Mr &amp; Mrs M. Arif Zia</p>
          <p>Mr &amp; Mrs M. Ramzan Adil</p>
        </div>
        <p className="words rv" aria-label="Specially welcome all our brothers, sisters and cousins">
          {'Specially welcome all our brothers, sisters & cousins 💛'.split(' ').map((w, i) => <span className="w" key={i} style={{ '--i': i }} aria-hidden="true">{w}&nbsp;</span>)}
        </p>
        <p className="credit">Made by H. Abdullah Adil<br /><a href="mailto:muhammadabdullahadil716@gmail.com">muhammadabdullahadil716@gmail.com</a></p>
      </footer>

      <audio ref={audio} src="/assets/audio/song.mp3" preload="metadata" />
      <div className={`toast ${toast ? 'show' : ''}`} role="status">{toast}</div>
    </>
  )
}