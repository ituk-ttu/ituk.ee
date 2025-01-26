import Button from "@/components/buttons/button"
import Image from "next/image"
import ituk_long_nottu_red from "@/assets/logos/style_examples/ituk_long_nottu_red.svg"
import ituk_long_ttu_red from "@/assets/logos/style_examples/ituk_long_ttu_red.svg"
import ituk_symbol_negative_red from "@/assets/logos/style_examples/ituk_symbol_negative_red.svg"
import ituk_symbol_red from "@/assets/logos/style_examples/ituk_symbol_red.svg"
import logotype_red_white from "@/assets/logos/style_examples/logotype_red_white.svg"
import protected_example from "@/assets/logos/style_examples/protected.svg"
import { Locale } from "../../../../i18nConfig";
import { getDictionary } from "@/dictionaries/dictionaries";

export default async function Home(props: {
    params: Promise<{ locale: Locale }>
}) {
    const { locale } = await props.params;

    const dictionary = (await getDictionary(locale)).style;
    return (
        <div className="main-padding flex-col justify-start items-start gap-16 flex">
            <div className="w-full flex-col justify-start items-start gap-8 flex">
                <h1>{dictionary.title}</h1>
                <p>{dictionary.last_updated}</p>
            </div>
            <div className="w-full flex-col justify-start items-start gap-8 flex">
                <h2>{dictionary.name_abbreviation.heading}</h2>
                <p>{dictionary.name_abbreviation.context}</p>
                <p>
                    {dictionary.name_abbreviation.valid_names_text}
                    <ul>
                        <li>{dictionary.name_abbreviation.valid_names_1}</li>
                        <li>{dictionary.name_abbreviation.valid_names_2}</li>
                        <li>{dictionary.name_abbreviation.valid_names_3}</li>
                        <li>{dictionary.name_abbreviation.valid_names_4}</li>
                    </ul>
                </p>
                <p>
                    {dictionary.name_abbreviation.alternative_names_text}
                    <ul>
                        <li>{dictionary.name_abbreviation.alternative_names_1}</li>
                        <li>{dictionary.name_abbreviation.alternative_names_2}</li>
                    </ul>
                </p>
                <p>{dictionary.name_abbreviation.important}</p>
                <p>{dictionary.name_abbreviation.abbreviation_case}</p>
            </div>
            <div className="w-full flex-col justify-start items-start gap-8 flex">
                <h2>{dictionary.logo.heading}</h2>
                <p>{dictionary.logo.description}</p>
                <Button variant="primary" big={true} text={dictionary.logo.download_button} href="/ITUK_stiiliraamat_27012025.zip" />
                <h3>{dictionary.logo.internal_use_heading}</h3>
                <p>{dictionary.logo.internal_use_context}</p>
                <div className="flex-col justify-start items-start gap-8 flex">
                    <h3>{dictionary.logo.logo_variants_heading}</h3>
                    <p>
                        {dictionary.logo.logo_variants_context}
                        <ul>
                            <li>{dictionary.logo.logo_variants_use_1}</li>
                            <li>{dictionary.logo.logo_variants_use_2}</li>
                            <li>{dictionary.logo.logo_variants_use_3}</li>
                        </ul>
                    </p>
                    <p>{dictionary.logo.icon_usage}</p>
                </div>
                <div className="w-full justify-start items-start gap-16 flex-wrap flex">
                    <div className="flex-col justify-start items-start gap-8 flex">
                        <h4>{dictionary.logo.long_variant_with_taltech}</h4>
                        <Image src={ituk_long_ttu_red} alt={dictionary.logo.long_variant_with_taltech} />
                    </div>
                    <div className="flex-col justify-start items-start gap-8 flex">
                        <h4>{dictionary.logo.long_variant_without_taltech}</h4>
                        <Image src={ituk_long_nottu_red} alt={dictionary.logo.long_variant_without_taltech} />
                    </div>
                    <div className="flex-col justify-start items-start gap-8 flex">
                        <h4>{dictionary.logo.logotype}</h4>
                        <Image src={logotype_red_white} alt={dictionary.logo.logotype} />
                    </div>
                    <div className="flex-col justify-start items-start gap-8 flex">
                        <h4>{dictionary.logo.icon}</h4>
                        <Image src={ituk_symbol_red} alt={dictionary.logo.icon} />
                    </div>
                    <div className="flex-col justify-start items-start gap-8 flex">
                        <h4>{dictionary.logo.icon_without_box}</h4>
                        <Image src={ituk_symbol_negative_red} alt={dictionary.logo.icon_without_box} />
                    </div>
                </div>
            </div>
            <div className="w-full flex-col justify-start items-start gap-8 flex">
                <h3>{dictionary.logo_colors.heading}</h3>
                <p>{dictionary.logo_colors.instructions}
                    <ul>
                        <li>{dictionary.logo_colors.color_usage_1}</li>
                        <li>{dictionary.logo_colors.color_usage_2}</li>
                        <li>{dictionary.logo_colors.color_usage_3}</li>
                    </ul>
                </p>
                <p>{dictionary.logo_colors.contrast_check} <a className="bold underline" href="https://webaim.org/resources/contrastchecker/">{dictionary.logo_colors.here}</a>.</p>
                <h3>{dictionary.logo_colors.protected_area.heading}</h3>
                <p>{dictionary.logo_colors.protected_area.description}</p>
                <Image src={protected_example} alt={dictionary.logo_colors.protected_area.description} />
                <p>{dictionary.logo_colors.protected_area.instructions}</p>
            </div>
            <div className="w-full flex-col justify-start items-start gap-8 flex">
                <h2>{dictionary.colors.heading}</h2>
                <h3>{dictionary.colors.primary_colors_heading}</h3>
                <div className="w-full h-full justify-start items-start flex-wrap flex">
                    <div className="bg-primary w-full sm:w-1/5 h-full p-4 flex-col justify-start items-start gap-4 flex">
                        <p>{dictionary.colors.primary_color_1_hex}</p>
                        <p>{dictionary.colors.primary_color_1_rgb}</p>
                        <p>{dictionary.colors.primary_color_1_cmyk}</p>
                    </div>
                    <div className="bg-secondary w-full sm:w-1/5 h-full p-4 flex-col justify-start items-start gap-4 flex">
                        <p>{dictionary.colors.primary_color_2_hex}</p>
                        <p>{dictionary.colors.primary_color_2_rgb}</p>
                        <p>{dictionary.colors.primary_color_2_cmyk}</p>
                    </div>
                    <div className="bg-gray w-full sm:w-1/5 h-full p-4 flex-col justify-start items-start gap-4 flex">
                        <p>{dictionary.colors.primary_color_3_hex}</p>
                        <p>{dictionary.colors.primary_color_3_rgb}</p>
                        <p>{dictionary.colors.primary_color_3_cmyk}</p>
                    </div>
                    <div className="bg-dark w-full sm:w-1/5 h-full p-4 flex-col justify-start items-start gap-4 flex">
                        <p>{dictionary.colors.primary_color_4_hex}</p>
                        <p>{dictionary.colors.primary_color_4_rgb}</p>
                        <p>{dictionary.colors.primary_color_4_cmyk}</p>
                    </div>
                    <div className="bg-light w-full sm:w-1/5 h-full p-4 flex-col justify-start items-start gap-4 flex">
                        <p className="text-dark">{dictionary.colors.primary_color_5_hex}</p>
                        <p className="text-dark">{dictionary.colors.primary_color_5_rgb}</p>
                        <p className="text-dark">{dictionary.colors.primary_color_5_cmyk}</p>
                    </div>
                </div>
            </div>
            <div className="flex-col justify-start items-start gap-8 flex">
                <h2>{dictionary.typography.heading}</h2>
                <p>{dictionary.typography.description}</p>
            </div>
            <div className="flex-col justify-start items-start gap-8 flex">
                <h2>{dictionary.contact.heading}</h2>
                <p>{dictionary.contact.description} <a className="bold underline" href={`mailto:${dictionary.contact.email}`}>{dictionary.contact.email}</a>.</p>
                <p>{dictionary.contact.note}</p>
            </div>
        </div >
    )
}