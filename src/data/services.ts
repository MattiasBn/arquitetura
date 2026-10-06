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
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791285196/algugest/imagens/telecomunicacoes/Telecomunica%C3%A7%C3%B5es.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791285186/algugest/imagens/telecomunicacoes/slid.telecomunicacao.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791285163/algugest/imagens/telecomunicacoes/obra-11.jpg",
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
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791284907/algugest/imagens/construcao-civil/Constru%C3%A7%C3%A3o%20civil%20e%20obras%20p%C3%BAblica.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791284912/algugest/imagens/construcao-civil/slid.construcaoSivil.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791284908/algugest/imagens/construcao-civil/obra-20.jpg",
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
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791284822/algugest/imagens/acabamento-interior/Acabamento%20de%20interior.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791284829/algugest/imagens/acabamento-interior/WhatsApp%20Image%202026-09-29%20at%2011.54.43%20%281%29.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791284838/algugest/imagens/acabamento-interior/WhatsApp%20Image%202026-09-29%20at%2011.54.43.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791284846/algugest/imagens/acabamento-interior/WhatsApp%20Image%202026-09-29%20at%2011.54.48%20%281%29.jpg",
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
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791284916/algugest/imagens/cozinhas/Aplica%C3%A7%C3%A3o%20de%20cozinhas%20por%20medida.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791284919/algugest/imagens/cozinhas/WhatsApp%20Image%202026-09-29%20at%2011.54.48.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791284918/algugest/imagens/cozinhas/WhatsApp%20Image%202026-09-29%20at%2011.54.44%20%283%29.jpg",
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
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791284901/algugest/imagens/carpintaria/Servi%C3%A7os%20de%20carpintaria.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791284903/algugest/imagens/carpintaria/WhatsApp%20Image%202026-09-29%20at%2011.54.42%20%282%29.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791284906/algugest/imagens/carpintaria/WhatsApp%20Image%202026-09-29%20at%2011.54.46%20%283%29.jpg",
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
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791285122/algugest/imagens/jardinagem/Jardinagem.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791285133/algugest/imagens/jardinagem/limpesa%20e%20desinfesta%C3%A7%C3%A3o.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791285135/algugest/imagens/jardinagem/WhatsApp%20Image%202026-09-29%20at%2011.54.41.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791285137/algugest/imagens/jardinagem/WhatsApp%20Image%202026-09-29%20at%2011.54.44%20%281%29.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791285138/algugest/imagens/jardinagem/WhatsApp%20Image%202026-09-29%20at%2011.54.45%20%281%29.jpg",
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
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791284887/algugest/imagens/ar-condicionado/Manuten%C3%A7%C3%A3o%20e%20montagem%20de%20ar-condicionado.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791284894/algugest/imagens/ar-condicionado/WhatsApp%20Image%202026-09-29%20at%2011.54.45.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791284892/algugest/imagens/ar-condicionado/WhatsApp%20Image%202026-09-29%20at%2011.54.43%20%282%29.jpg",
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
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791285155/algugest/imagens/postes-iluminacao/Montagem%20e%20manunte%C3%A7%C3%A3o%20de%20postes%20de%20ilumina%C3%A7%C3%A3o.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791285156/algugest/imagens/postes-iluminacao/WhatsApp%20Image%202026-09-29%20at%2011.54.47.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791285157/algugest/imagens/postes-iluminacao/WhatsApp%20Image%202026-09-29%20at%2011.54.48%20%282%29.jpg",
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
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791284921/algugest/imagens/edificios/Constru%C3%A7%C3%A3o%20de%20edif%C3%ADcios.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791284926/algugest/imagens/edificios/edificio.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791284929/algugest/imagens/edificios/obra-12.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791284930/algugest/imagens/edificios/obra-15.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791284931/algugest/imagens/edificios/obra-16.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791284933/algugest/imagens/edificios/obra-17.jpg",
      "https://res.cloudinary.com/z50slpsg/image/upload/v1791284935/algugest/imagens/edificios/WhatsApp%20Image%202026-09-29%20at%2011.54.44.jpg",
    ],
  },
];

/** Encontra um servico pelo slug. */
export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
