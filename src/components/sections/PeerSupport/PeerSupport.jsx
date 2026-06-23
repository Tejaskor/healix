import './PeerSupport.scss'

const PEER_VIDEO = '/images/peer__video.webm'

const PeerSupport = () => {
  return (
    <section className="peer">
      <div className="peer__inner">
        <div className="peer__content">
          <span className="peer__badge">Community support</span>
          <h2 className="peer__heading">You’re not doing this alone</h2>
          <p className="peer__description">
            Connect with others on the same path and stay inspired every step
            of the way.
          </p>
          <button className="peer__btn" aria-disabled="true">Join the community</button>
          <p className="peer__note">
            Community access availability may vary by membership plan.
          </p>
        </div>

        <div className="peer__video-wrap">
          <video
            className="peer__video"
            autoPlay
            muted
            loop
            playsInline
           preload="metadata">
            <source src={PEER_VIDEO} type="video/webm" />
            {/* <source src={`${videoBase}.mp4`} type="video/mp4" /> */}
          </video>
        </div>
      </div>
    </section>
  )
}

export default PeerSupport
