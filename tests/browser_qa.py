from playwright.sync_api import sync_playwright
import json, os
os.makedirs('qa',exist_ok=True)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1440,'height':1000})
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 requests=[];page.on('request',lambda r:requests.append(r.url))
 page.goto('http://127.0.0.1:8765');page.wait_for_function("document.querySelector('#result-title').textContent==='A matching schedule'")
 page.screenshot(path='qa/desktop.png',full_page=True)
 assert page.locator('.timeline li').count()==9
 page.locator('[data-key="slots"]').nth(1).fill('2')
 assert page.locator('#stale').count()==1 and page.locator('#print').is_disabled()
 page.locator('#check').click();page.wait_for_function("document.querySelector('#result-title').textContent==='These inputs conflict'")
 page.locator('#sample').click();page.wait_for_function("document.querySelector('#result-title').textContent==='A matching schedule'")
 page.locator('#unit').select_option('C');assert page.locator('[data-key="temp"]').first.input_value()=='176.67'
 page.locator('#check').click();page.wait_for_function("document.querySelector('#result-title').textContent==='A matching schedule'")
 page.locator('[data-key="duration"]').first.fill('');page.locator('#check').click();assert page.locator('#result-title').inner_text()=='Check these inputs'
 page.locator('#sample').click();page.wait_for_function("document.querySelector('#result-title').textContent==='A matching schedule'")
 page.locator('[data-key="name"]').first.fill('<img src=x onerror=alert(1)>');page.locator('#check').click();page.wait_for_function("document.querySelector('#result-title').textContent==='A matching schedule'");assert page.locator('#result-body img').count()==0
 page.locator('#sample').click();page.wait_for_function("document.querySelector('#result-title').textContent==='A matching schedule'")
 page.emulate_media(media='print');page.pdf(path='qa/print-plan.pdf',format='A4');page.emulate_media(media='screen')
 for width in [320,375,390,768]:
  page.set_viewport_size({'width':width,'height':844});assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth'),f'overflow {width}'
 page.set_viewport_size({'width':390,'height':844});page.screenshot(path='qa/mobile.png',full_page=True)
 for file in ['guide.html','privacy.html']:
  page.goto('http://127.0.0.1:8765/'+file);assert page.locator('h1').count()==1;assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth')
 assert not errors,errors
 assert all(x.startswith('http://127.0.0.1:8765/') for x in requests),requests
 print(json.dumps({'page_errors':errors,'external_requests':0,'viewports':[320,375,390,768,1440],'tests':['sample','conflict','stale print protection','Celsius conversion','validation','XSS-safe rendering','print PDF','responsive overflow','guide and privacy pages']},indent=2))
 browser.close()
