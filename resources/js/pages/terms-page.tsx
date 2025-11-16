import { Layout } from "@/layout";
import { Helmet } from "react-helmet-async";

export default function TermsPage() {
    return (
        <Layout>
            <Helmet>
                <title>Termos de Uso - BroderLab</title>
                <meta
                    name="description"
                    content="Termos de uso do blog BroderLab"
                />
            </Helmet>
            <div className="container mx-auto max-w-4xl px-4 py-12">
                <h1 className="mb-8 text-4xl font-bold">Termos de Uso</h1>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
                        <p className="text-muted-foreground">
                            Ao acessar e usar o BroderLab, você aceita e concorda em cumprir estes termos de uso.
                            Se você não concordar com algum destes termos, não use este site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. Uso do Conteúdo</h2>
                        <p className="text-muted-foreground">
                            O conteúdo publicado no BroderLab é fornecido apenas para fins informativos e educacionais.
                            Você pode compartilhar e referenciar o conteúdo, desde que dê os devidos créditos ao autor original.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. Propriedade Intelectual</h2>
                        <p className="text-muted-foreground">
                            Todo o conteúdo publicado neste blog, incluindo textos, imagens e códigos, é de propriedade
                            do BroderLab e seus autores, salvo indicação em contrário. O uso comercial não autorizado
                            é estritamente proibido.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. Comentários e Interações</h2>
                        <p className="text-muted-foreground">
                            Ao deixar comentários ou interagir com o conteúdo, você concorda em manter um tom respeitoso
                            e profissional. Comentários ofensivos, spam ou conteúdo inadequado serão removidos.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. Privacidade</h2>
                        <p className="text-muted-foreground">
                            Respeitamos sua privacidade. Coletamos apenas as informações necessárias para fornecer
                            nossos serviços, como autenticação via Google OAuth. Não compartilhamos seus dados pessoais
                            com terceiros sem seu consentimento.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">6. Isenção de Responsabilidade</h2>
                        <p className="text-muted-foreground">
                            O conteúdo fornecido é apresentado "como está". Não garantimos que as informações sejam
                            sempre precisas, completas ou atualizadas. Você usa as informações por sua própria conta e risco.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">7. Modificações dos Termos</h2>
                        <p className="text-muted-foreground">
                            Reservamos o direito de modificar estes termos a qualquer momento. As alterações entrarão
                            em vigor imediatamente após sua publicação. Recomendamos revisar esta página periodicamente.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">8. Contato</h2>
                        <p className="text-muted-foreground">
                            Para questões sobre estes termos, entre em contato através do site{" "}
                            <a
                                href="https://devbroder.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                DevBroder
                            </a>.
                        </p>
                    </section>

                    <p className="text-sm text-muted-foreground mt-8">
                        Última atualização: {new Date().toLocaleDateString('pt-BR')}
                    </p>
                </div>
            </div>
        </Layout>
    );
}
