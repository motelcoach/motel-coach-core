# Forms and downloads

Enquiry forms post to Web3Forms. File downloads are direct links. Nothing on the site talks to Zapier.

## Enquiry form

Add `class="enquiry-form"` and `data-success="#some-id"`. The success element must sit outside the form. The shared handler in `src/layouts/BaseLayout.astro` posts the fields and shows that element only after Web3Forms confirms the send.

```html
<div id="example-success" class="hidden">
  <p>Message received.</p>
</div>
<form class="enquiry-form space-y-4" action="#" method="POST" data-success="#example-success">
  <input type="hidden" name="source_page" value="Page name" />
  <input type="hidden" name="form_type" value="general-contact" />
  <div class="hidden" aria-hidden="true">
    <input type="text" name="last_name_verification" value="" autocomplete="off" tabindex="-1" />
  </div>
  <input type="email" name="email" required />
  <button type="submit">Send</button>
</form>
```

`form_type` sets the email subject. Known values live in the subject map in `BaseLayout.astro`. Add a new one there if the form is a new kind of enquiry.

The access key lives in `src/lib/web3forms-key.ts`. It is a public key. Web3Forms expects it in the browser.

## Download

Put the file in `public/downloads/` and link it. Do not gate it behind an email field.

```html
<a href="/downloads/front-office-checklist.xlsx" download>Download the guide</a>
```
