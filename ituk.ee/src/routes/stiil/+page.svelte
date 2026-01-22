<script lang="ts">
    import * as m from "$lib/paraglide/messages";
    import PageHeader from "$lib/components/PageHeader.svelte";
    import Button from "$lib/components/Button.svelte";
    import SEO from "$lib/components/SEO.svelte";
</script>

<SEO pageKey="stiil" />

<div>
    <PageHeader title={m.style_title()} backgroundImage="/headers/style.jpg" />

    <div class="section-padding container-content flex flex-col gap-16">
        <p class="text-gray text-center">{m.style_last_updated()}</p>

        <!-- Name and Abbreviation Section -->
        <section class="flex flex-col gap-4">
            <h2>{m.style_name_heading()}</h2>
            <p>{m.style_name_context()}</p>
            <p>{m.style_name_valid_text()}</p>
            <ul>
                <li>{m.style_name_valid1()}</li>
                <li>{m.style_name_valid2()}</li>
                <li>{m.style_name_valid3()}</li>
                <li>{m.style_name_valid4()}</li>
            </ul>
            <p>{m.style_name_alt_text()}</p>
            <ul>
                <li>{m.style_name_alt1()}</li>
                <li>{m.style_name_alt2()}</li>
            </ul>
            <p class="text-primary font-bold">{m.style_name_important()}</p>
            <p>{m.style_name_abbreviation()}</p>
        </section>

        <!-- Logo Section -->
        <section class="flex flex-col gap-4">
            <h2>{m.style_logo_heading()}</h2>
            <p>{m.style_logo_description()}</p>
            <Button
                variant="primary"
                size="lg"
                text={m.style_logo_download()}
                href="/ITUK_stiiliraamat_27012025.zip"
            />

            <h3>{m.style_logo_internal_heading()}</h3>
            <p>{m.style_logo_internal_context()}</p>

            <h3>{m.style_logo_variants_heading()}</h3>
            <p>{m.style_logo_variants_context()}</p>
            <ul>
                <li>{m.style_logo_variants_use1()}</li>
                <li>{m.style_logo_variants_use2()}</li>
                <li>{m.style_logo_variants_use3()}</li>
            </ul>
            <p>{m.style_logo_icon_usage()}</p>

            <!-- Logo variants display -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                <div class="flex flex-col gap-2">
                    <p class="font-bold">{m.style_logo_long_with_taltech()}</p>
                    <div class="bg-white p-4 rounded">
                        <img
                            src="/logos/ituk_taltech_color.svg"
                            alt="ITÜK logo with TalTech"
                            class="w-full"
                        />
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <p class="font-bold">
                        {m.style_logo_long_without_taltech()}
                    </p>
                    <div class="bg-white p-4 rounded">
                        <img
                            src="/logos/ituk_color.svg"
                            alt="ITÜK logo without TalTech"
                            class="w-full"
                        />
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <p class="font-bold">{m.style_logo_icon()}</p>
                    <div class="bg-white p-4 rounded flex justify-center">
                        <img
                            src="/logos/ituk_symbol_color.svg"
                            alt="ITÜK icon"
                            class="h-24"
                        />
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <p class="font-bold">{m.style_logo_icon_without_box()}</p>
                    <div
                        class="bg-background border border-white p-4 rounded flex justify-center"
                    >
                        <img
                            src="/logos/ituk_symbol_white.svg"
                            alt="ITÜK icon negative"
                            class="h-24"
                        />
                    </div>
                </div>
            </div>
        </section>

        <!-- Logo Colors Section -->
        <section class="flex flex-col gap-4">
            <h2>{m.style_colors_heading()}</h2>
            <p>{m.style_colors_instructions()}</p>
            <ul>
                <li>{m.style_colors_usage1()}</li>
                <li>{m.style_colors_usage2()}</li>
                <li>{m.style_colors_usage3()}</li>
            </ul>
            <p>
                {m.style_colors_contrast()}
                <a
                    href="https://webaim.org/resources/contrastchecker/"
                    target="_blank"
                    class="text-primary underline">{m.style_colors_here()}</a
                >.
            </p>

            <h3>{m.style_protected_heading()}</h3>
            <p>{m.style_protected_description()}</p>
            <p>{m.style_protected_instructions()}</p>
        </section>

        <!-- Primary Colors Section -->
        <section class="flex flex-col gap-4">
            <h2>{m.style_primary_heading()}</h2>
            <h3>{m.style_primary_colors_heading()}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div class="flex flex-col">
                    <div class="w-full h-24 bg-[#870042] rounded-t"></div>
                    <div class="bg-white/10 p-2 rounded-b text-sm">
                        <p>HEX: #870042</p>
                        <p>RGB: 135, 0, 66</p>
                    </div>
                </div>
                <div class="flex flex-col">
                    <div class="w-full h-24 bg-[#ad0054] rounded-t"></div>
                    <div class="bg-white/10 p-2 rounded-b text-sm">
                        <p>HEX: #ad0054</p>
                        <p>RGB: 173, 0, 84</p>
                    </div>
                </div>
                <div class="flex flex-col">
                    <div class="w-full h-24 bg-[#4c4c4e] rounded-t"></div>
                    <div class="bg-white/10 p-2 rounded-b text-sm">
                        <p>HEX: #4c4c4e</p>
                        <p>RGB: 76, 76, 78</p>
                    </div>
                </div>
                <div class="flex flex-col">
                    <div
                        class="w-full h-24 bg-[#131313] rounded-t border border-white/20"
                    ></div>
                    <div class="bg-white/10 p-2 rounded-b text-sm">
                        <p>HEX: #131313</p>
                        <p>RGB: 19, 19, 19</p>
                    </div>
                </div>
                <div class="flex flex-col">
                    <div class="w-full h-24 bg-[#eeeeee] rounded-t"></div>
                    <div class="bg-white/10 p-2 rounded-b text-sm">
                        <p>HEX: #eeeeee</p>
                        <p>RGB: 238, 238, 238</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Typography Section -->
        <section class="flex flex-col gap-4">
            <h2>{m.style_typography_heading()}</h2>
            <p>{m.style_typography_description()}</p>
            <div class="flex flex-col gap-4 mt-4">
                <p class="font-raleway text-4xl">
                    Raleway - ABCDEFGHIJKLMNOPQRSTUVWXYZ
                </p>
                <p class="font-noto text-4xl">
                    Noto Sans Georgian - ABCDEFGHIJKLMNOPQRSTUVWXYZ
                </p>
            </div>
        </section>

        <!-- Contact Section -->
        <section class="flex flex-col gap-4">
            <h2>{m.style_contact_heading()}</h2>
            <p>{m.style_contact_description()}</p>
            <a
                href="mailto:kontakt@ituk.ee"
                class="text-primary underline hover:brightness-125 font-bold"
                >{m.style_contact_email()}</a
            >
            <p class="text-primary">{m.style_contact_note()}</p>
        </section>
    </div>
</div>
