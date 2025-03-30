import axios from 'axios';
import { showAlert } from './alerts';

// const stripe = Stripe(
//   'pk_test_51R82moD7mAv5uBmFwVQzgCibpvvyn0VIXLdJGxks3BWAMcT925e48kHdKhWWODmQgOrNpMPzBxxd1nJ3Cub2RsCC007jD5kACP'
// );

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create checkout form
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
