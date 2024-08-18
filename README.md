
# Description

## Brief

an easy chrome extension to inject your word to prompt and queue prompt.
If you have many different prompt words for a same prompt, you can use it queue prompt easily.
For example, like <https://civitai.com/models/444414/gakuen-idolmaster-aio-lora>, there are different trigger words for 1 lora. It can easily replace the placeholder with your trigger words and queue prompt, if you want to make queue different characters' prompts.

## Install

To install the chrome extension, download the `dist___.zip` from releases.
And then go to the extension url <chrome://extensions/>, and then drag the zip to the page.

## Support Version

`1.0.1` do not support new frontend(Vue) of ComfyUI.

## How to use and Result

![text](./description/text_content.png)

Firstly, you should write your words in (.md) or (.txt).
Per time will replace the placeholder with one row. (You can see the images if you don't know how it works.)

![config](./description/prompt_setting.png)

After you install the extensions, you can see the extension on the top-left corner of the page. Click the `Formatter` will open the dialog.
Write place holder on prompt with `{}` , like `{pos1}`(the placeholder should not be same).
After you write all of you placeholders, click `Find Placeholder`, and it show the available placeholder.
Upload your text file for placeholders respectively.
And then click `Submit!`

![Queue](./description/queue.png)

It will queue prompt with your prompt text.
If the `Submit Times` > your rows, it will repeat from the first row. (Please see the result)

![Result](./description/prompt_result.png)

All the prompt queued like the image above. You can see that, the `{pos2}` only contains 3 rows but it runs 4 times. So it will repeat from the first row (`char1`).

## config

- `Lags(ms)`: If your `Batch count` is not 1, it may cause some promblems because the backend of ComfyUI can not process new requests too often. It may cause the injection does not work. Please edit lags if your `Batch count` larger than 1.

## Text input of Lora Loader and Checkpoint Loader

You can use this extension with <https://github.com/Sieyalixnet/ComfyUI_Textarea_Loaders>, to load the Checkpoint or Lora dynamically.

## Supplement

Because it costs $5 to "become a developer". I will upload the extension with package on the release instead of find it on the extension shop.

## Dev

```shell
pnpm install
pnpm watch
```

And then install the unpacked in Chrome.