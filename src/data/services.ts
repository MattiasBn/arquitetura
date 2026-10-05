/**
 * Fonte unica de verdade dos servicos da Algugest.
 *
 * As descricoes vem da "Carta de Apresentacao 2025" (paginas 2-4).
 * Os caminhos de imagem usam os nomes exactos dos ficheiros em
 * public/imagens —atencao: ha acentos e um "limpesa" sem "z".
 */

export type Service = {
  /** Usado no URL: /servicos/<slug> */
  slug: string;
  /** Nome curto para o cartao/accordion. */
  title: string;
  /** Frase curta (uma linha) para o cartao. */
  summary: string;
  /** Texto de marketing que antecipa a descrição — faz querer contratar. */
  intro: string;
  /** Texto corrido da pagina do servico. */
  description: string;
  /** O que esta incluido — usado como lista na pagina. */
  includes: string[];
  /** Caminhos em /public. Vazio = ainda sem foto atribuida. */
  images: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "telecomunicacoes",
    title: "Telecomunicações",
    summary: "Montagem de antenas de redes de comunicação.",
    intro:
      "Cobertura, sinal e ligações que funcionam onde você precisa — instaladas, alinhadas e testadas por técnicos especializados.",
    description:
      "Num mundo em que estar ligado não é luxo, é necessidade, ter sinal onde se precisa muda tudo. A Algugest instala, alinha e testa redes de comunicação com o rigor de quem conhece o setor por dentro.\n\nSeja para cobrir uma zona, reforçar uma rede ou garantir comunicação estável numa obra, contamos com técnicos experientes que trabalham em altura com segurança e deixam tudo a funcionar como deve ser — do primeiro teste ao acompanhamento que se segue.",
    includes: ["Montagem de antenas", "Redes de comunicação", "Alinhamento e testes de sinal"],
    images: [
      "/imagens/telecomunicacoes/Telecomunicações.jpg",
      "/imagens/telecomunicacoes/slid.telecomunicacao.jpg",
      "/imagens/telecomunicacoes/obra-11.jpg",
    ],
  },
  {
    slug: "construcao-civil-e-obras-publicas",
    title: "Construção Civil e Obras Públicas",
    summary: "Planeamento, projeto, edificação e manutenção de infraestruturas.",
    intro:
      "Do terreno vazio à obra entregue: planeamento, edificação e manutenção com um único responsável e qualidade de referência.",
    description:
      "A obra começa muito antes do primeiro tijolo: começa com o sonho de um espaço que serve as pessoas. A Algugest acompanha esse sonho do plano ao projeto final — planeamento, edificação e manutenção — com a responsabilidade de quem assina obras que vão durar.\n\nEm obras públicas e privadas, rigor e cumprimento de prazos não são extras, são o mínimo. É exatamente esse o padrão que levamos a cada estaleiro: materiais certos, métodos seguros e um responsável que responde por tudo, sempre.",
    includes: [
      "Planeamento e projeto",
      "Edificação",
      "Manutenção de infraestruturas",
    ],
    images: [
      "/imagens/construcao-civil/Construção civil e obras pública.jpg",
      "/imagens/construcao-civil/slid.construcaoSivil.jpg",
      "/imagens/construcao-civil/obra-20.jpg",
    ],
  },
  {
    slug: "acabamento-de-interior",
    title: "Acabamento de Interior",
    summary: "Ladrilho, teto falso, estuque e pintura — a última etapa da obra.",
    intro:
      "É na última etapa que a obra ganha cara. Ladrilho, teto falso, estuque e pintura com um acabamento impecável.",
    description:
      "Depois da estrutura e do cimento, chega o momento que todos esperamos: quando a obra começa a parecer casa. O piso ganha brilho, o teto desce sobre o espaço com precisão e as paredes recebem a cor que transforma um imóvel numa morada.\n\nNão há espaço para atalhos nesta fase — e por isso a Algugest trata cada centímetro como se fosse da própria casa: ladrilhos alinhados à régua, cantos perfeitos, pintura limpa do primeiro ao último traço. O resultado é um ambiente que impressiona à entrada e dá orgulho todos os dias.",
    includes: ["Ladrilho", "Teto falso", "Estuque", "Pintura"],
    images: [
      "/imagens/acabamento-interior/Acabamento de interior.jpg",
      "/imagens/acabamento-interior/WhatsApp Image 2026-09-29 at 11.54.43 (1).jpeg",
      "/imagens/acabamento-interior/WhatsApp Image 2026-09-29 at 11.54.43.jpeg",
      "/imagens/acabamento-interior/WhatsApp Image 2026-09-29 at 11.54.48 (1).jpeg",
    ],
  },
  {
    slug: "aplicacao-de-cozinhas-por-medida",
    title: "Aplicação de Cozinhas por Medida",
    summary: "Projetadas e montadas para aproveitar cada canto, sem espaço vazio.",
    intro:
      "Cozinhas desenhadas e montadas para o seu espaço: cada canto aproveitado, organizado e sem espaço vazio.",
    description:
      "A cozinha é o coração da casa — onde o dia começa e as histórias se cozinham. Por isso, cada projeto é pensado à medida do seu espaço, para que nenhum centímetro seja desperdiçado e tudo tenha o seu lugar.\n\nDa escolha dos materiais à montagem final, a Algugest concebe e instala cozinhas que combinam beleza e funcionalidade: armários que fecham bem, bancadas à altura certa e um resultado que parece ter nascido ali — porque foi feito para ali.",
    includes: ["Projeto à medida", "Montagem", "Aproveitamento de espaço"],
    images: [
      "/imagens/cozinhas/Aplicação de cozinhas por medida.jpg",
      "/imagens/cozinhas/WhatsApp Image 2026-09-29 at 11.54.48.jpeg",
      "/imagens/cozinhas/WhatsApp Image 2026-09-29 at 11.54.44 (3).jpeg",
    ],
  },
  {
    slug: "carpintaria-e-caixilharia",
    title: "Carpintaria e Caixilharia",
    summary: "Serviços de carpintaria e caixilharia.",
    intro:
      "Madeira e caixilharia com rigor: portas, janelas e estruturas que valorizam a obra e duram mais.",
    description:
      "Há peças que transformam um espaço simples num espaço incomparável: uma porta sólida, uma janela que encontra o seu vão, um detalhe em madeira que dá alma ao ambiente. É isso que faz a carpintaria e caixilharia da Algugest.\n\nTrabalhamos com rigor nas medidas, cuidado nos remates e atenção aos materiais, porque é isso que garante que portas e janelas abrem, fecham e duram. O resultado é uma obra que valoriza — e uma casa que se sente na mão.",
    includes: ["Carpintaria", "Caixilharia"],
    images: [
      "/imagens/carpintaria/Serviços de carpintaria.jpeg",
      "/imagens/carpintaria/WhatsApp Image 2026-09-29 at 11.54.42 (2).jpeg",
      "/imagens/carpintaria/WhatsApp Image 2026-09-29 at 11.54.46 (3).jpeg",
    ],
  },
  {
    slug: "jardinagem-limpeza-e-desinfestacao",
    title: "Jardinagem, Limpeza e Desinfestação",
    summary: "Jardinagem, limpeza e desinfestação.",
    intro:
      "Espaços verdes cuidados e instalações higienizadas — a apresentação e a saúde do seu ambiente em primeiro lugar.",
    description:
      "Um espaço verde cuidado diz muito sobre a casa que o tem. A Algugest trata da jardinagem para que o seu exterior esteja sempre no melhor estado — e vai mais longe: limpeza e desinfestação que protegem a saúde de quem vive e trabalha no espaço.\n\nDo relvado às plantas, da higienização de áreas comuns ao controlo de pragas, cuidamos do ambiente com produtos seguros e equipas preparadas. Porque um bom serviço não é só o que se vê — é também o que não se vê, e nos deixa tranquilos.",
    includes: ["Jardinagem", "Limpeza", "Desinfestação"],
    images: [
      "/imagens/jardinagem/Jardinagem.jpg",
      "/imagens/jardinagem/limpesa e desinfestação.jpg",
      "/imagens/jardinagem/WhatsApp Image 2026-09-29 at 11.54.41.jpeg",
      "/imagens/jardinagem/WhatsApp Image 2026-09-29 at 11.54.44 (1).jpeg",
      "/imagens/jardinagem/WhatsApp Image 2026-09-29 at 11.54.45 (1).jpeg",
    ],
  },
  {
    slug: "ar-condicionado",
    title: "Manutenção e Montagem de Ar-Condicionado",
    summary: "Montagem e manutenção de ar-condicionado.",
    intro:
      "Clima confortável em qualquer estação: instalação e manutenção de ar-condicionado feitas por quem entende do assunto.",
    description:
      "Quando a temperatura aperta, a diferença entre um dia difícil e um dia normal está no ar que respiramos. A Algugest garante que o seu ar-condicionado trabalha por si — montado no sítio certo, com a potência certa e mantido ao longo do tempo.\n\nMontagem cuidada, manutenção preventiva e assistência quando precisa: para casa ou para escritório, deixamos tudo a funcionar no máximo, com eficiência e sem surpresas no orçamento do fim do mês.",
    includes: ["Montagem", "Manutenção"],
    images: [
      "/imagens/ar-condicionado/Manutenção e montagem de ar-condicionado.jpg",
      "/imagens/ar-condicionado/WhatsApp Image 2026-09-29 at 11.54.45.jpeg",
      "/imagens/ar-condicionado/WhatsApp Image 2026-09-29 at 11.54.43 (2).jpeg",
    ],
  },
  {
    slug: "postes-de-iluminacao",
    title: "Montagem e Manutenção de Postes de Iluminação",
    summary:
      "Planeamento técnico, fixação segura no solo e conservação dos componentes.",
    intro:
      "Iluminação pública segura e duradoura: planeamento técnico, fixação no solo e conservação dos componentes elétricos e mecânicos.",
    description:
      "A iluminação pública muda a forma como vivemos a cidade: mais segurança, mais vida, mais ordem depois do pôr do sol. Montar e manter postes de iluminação exige planeamento, técnica e respeito pela segurança.\n\nA Algugest cuida do estudo técnico do terreno, da fixação sólida de cada estrutura e da conservação dos componentes elétricos e mecânicos, para que a luz fique onde é preciso — e fique por muito tempo.",
    includes: [
      "Planeamento técnico",
      "Fixação segura da estrutura no solo",
      "Conservação de componentes elétricos e mecânicos",
    ],
    images: [
      "/imagens/postes-iluminacao/Montagem e manunteção de postes de iluminação.jpg",
      "/imagens/postes-iluminacao/WhatsApp Image 2026-09-29 at 11.54.47.jpeg",
      "/imagens/postes-iluminacao/WhatsApp Image 2026-09-29 at 11.54.48 (2).jpeg",
    ],
  },
  {
    slug: "construcao-de-edificios",
    title: "Construção de Edifícios",
    summary: "Transformar um terreno vazio num prédio pronto para morar ou trabalhar.",
    intro:
      "Transformamos terrenos em prédios prontos para morar ou trabalhar — da fundação à finalização, sem surpresas.",
    description:
      "Um edifício nasce de um terreno e de uma visão. A Algugest transforma essa visão em concreto: fundações seguras, estruturas que se erguem, fachadas que ganham forma e espaços prontos para receber quem vai morar ou trabalhar.\n\nDa fundação à finalização, cada etapa tem cronograma, controlo e um responsável que acompanha de perto. É por isso que os nossos edifícios chegam ao fim como começaram: dentro do previsto, com a qualidade que o cliente merece.",
    includes: ["Construção de edifícios", "Obra nova", "Finalização de obra"],
    images: [
      "/imagens/edificios/Construção de edifícios.jpg",
      "/imagens/edificios/edificio.jpg",
      "/imagens/edificios/obra-12.jpg",
      "/imagens/edificios/obra-15.jpg",
      "/imagens/edificios/obra-16.jpg",
      "/imagens/edificios/obra-17.jpg",
      "/imagens/edificios/WhatsApp Image 2026-09-29 at 11.54.44.jpeg",
    ],
  },
];

/** Encontra um servico pelo slug. */
export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
