export default function Footer() {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container">
        <div className="row">
          {/* Left Section: About */}
          <div className="col-md-6">
            <h5>About Us</h5>
            <p>
              Instant⚡Tickets is your go-to platform for booking tickets to
              movies. Enjoy a seamless and fast experience.
            </p>
          </div>

          {/* Middle Section: Useful Links */}
          <div className="col-md-3">
            <h5>Useful Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#home" className="text-white text-decoration-none">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-white text-decoration-none">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="text-white text-decoration-none">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Right Section: Social Media */}
          <div className="col-md-3">
            <h5>Follow Us</h5>
            <ul className="list-unstyled d-flex">
              <li>
                <a href="#" className="text-white fs-3 me-3">
                  <i className="fab fa-facebook-f"></i>
                </a>
              </li>
              <li>
                <a href="#" className="text-white fs-3 me-3">
                  <i className="fab fa-x-twitter"></i>
                </a>
              </li>
              <li>
                <a href="#" className="text-white fs-3 me-3">
                  <i className="fab fa-instagram"></i>
                </a>
              </li>
              <li>
                <a href="#" className="text-white fs-3 me-3">
                  <i className="fab fa-linkedin"></i>
                </a>
              </li>
              <li>
                <a href="#" className="text-white fs-3 me-3">
                  <i className="fab fa-pinterest"></i>
                </a>
              </li>
              <li>
                <a href="#" className="text-white fs-3 me-3">
                  <i className="fab fa-youtube"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="row mt-3">
          <div className="col-12 text-center">
            <p>&copy; 2025 Instant⚡Tickets. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
