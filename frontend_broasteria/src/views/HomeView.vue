<script setup lang="ts">

</script>

<template>
      <section id="story" class="description_content">
            <div class="text-content container">
                <div class="col-md-6">
                    <h1>Inicio</h1>
                    <div class="fa fa-cutlery fa-2x"></div>
                    <p class="desc-text">"El Sabor del Pollo", donde en cada bocado resalta el sabor en nuestros productos.
Utilizamos solo los ingredientes más frescos, garantizando un sabor único y una textura crujiente.
Para vengas con la familia, con amigos o simplemente desees un almuerzo rápido, nuestro ambiente acogedor y un servicio al cliente excepcional te harán sentir como en casa.
"El Sabor del Pollo" es la elección preferida de quienes buscan calidad, sabor y una experiencia inolvidable.</p>
                </div>
                <div class="col-md-6">
                    <div class="img-section">
                       <img src="@/assets/images/kabob.jpg" width="250" height="220">
                       <img src="@/assets/images/limes.jpg" width="250" height="220">
                       <div class="img-section-space"></div>
                       <img src="@/assets/images/radish.jpg"  width="250" height="220">
                       <img src="@/assets/images/corn.jpg"  width="250" height="220">
                   </div>
                </div>
            </div>
        </section>


       <!-- ============ Pricing  ============= -->


        <section id ="pricing" class="description_content">
             <div class="pricing background_content">
                <h1>Hechos con ingredientes naturales</h1>
             </div>
            <div class="text-content container"> 
                <div class="container">
                    <div class="row">
                        <div id="w">
                            <ul id="filter-list" class="clearfix">
                                
                            </ul><!-- @end #filter-list -->    
                            <ul id="portfolio">
                                <li class="item breakfast"><img src="@/assets/images/food_icon01.jpg" alt="Food" >
                                    <h2 class="white">$20</h2>
                                </li>

                                <li class="item dinner special"><img src="@/assets/images/food_icon02.jpg" alt="Food" >
                                    <h2 class="white">$20</h2>
                                </li>
                                <li class="item dinner breakfast"><img src="@/assets/images/food_icon03.jpg" alt="Food" >
                                    <h2 class="white">$18</h2>
                                </li>
                                <li class="item special"><img src="@/assets/images/food_icon04.jpg" alt="Food" >
                                    <h2 class="white">$15</h2>
                                </li>
                                <li class="item dinner"><img src="@/assets/images/food_icon05.jpg" alt="Food" >
                                    <h2 class="white">$20</h2>
                                </li>
                                <li class="item special"><img src="@/assets/images/food_icon06.jpg" alt="Food" >
                                    <h2 class="white">$22</h2>
                                </li>
                                <li class="item desert"><img src="@/assets/images/food_icon07.jpg" alt="Food" >
                                    <h2 class="white">$32</h2>
                                </li>
                                <li class="item desert breakfast"><img src="@/assets/images/food_icon08.jpg" alt="Food" >
                                    <h2 class="white">$38</h2>
                                </li>
                            </ul><!-- @end #portfolio -->
                        </div><!-- @end #w -->
                    </div>
                </div>
            </div>  
        </section>


        <!-- ============ Our Beer  ============= -->


        <section id ="beer" class="description_content">
            <div  class="beer background_content">
                <h1>Buen lugar para comer</h1>
            </div>
            <div class="text-content container"> 
                <div class="col-md-5">
                   <div class="img-section">
                       <img src="@/assets/images/beer_spec.jpg" width="100%">
                   </div>
                </div>
                <br>
                <div class="col-md-6 col-md-offset-1">
                    <h1>Nuestras Bedidas</h1>
                    <div class="icon-beer fa-2x"></div>
                    <p class="desc-text">En nuestra Broastería no solo ofrecemos comida, sino también una variedad de gaseosas para que disfrute como acompañante de su comida, entre estas la más consumida Coca Cola.

                    </p>
                </div>
            </div>
        </section>


       <!-- ============ Our Bread  ============= -->


        <section id="bread" class=" description_content">
            <div  class="bread background_content">
                <h1>Nuestras salsas</h1>
            </div>
            <div class="text-content container"> 
                <div class="col-md-6">
                    <h1>Nuestras salsas</h1>
                    <div class="icon-bread fa-2x"></div>
                    <p class="desc-text">Para los amantes del sabor les ofrecemos una variedad de salsas como ser mayonesa, ketchup, mostaza, llajua, entre otros.</p>
                </div>
                <div class="col-md-6">
                    <img src="@/assets/images/bread1.jpg" width="260" alt="Bread">
                    <img src="@/assets/images/bread1.jpg" width="260" alt="Bread">
                </div>
            </div>
        </section>


        
        <!-- ============ Featured Dish  ============= -->

        <section id="featured" class="description_content">
            <div  class="featured background_content">
                <h1>Nuestro Menú</h1>
            </div>
            <div class="text-content container"> 
                <div class="col-md-6">
                    <h1>Nuestro Menú</h1>
                    <div class="icon-hotdog fa-2x"></div>
                    <p class="desc-text">Respecto al menú, ofrecemos un menú dirigido a la comida rápida, para que no tengas que esperar horas por un plato, nosotros te ofrecemos pollo a la Broaster, Hamburguesas, entre otros.</p>
                </div>
                <div class="col-md-6">
                    <ul class="image_box_story2">
                        <div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
                            <!-- Indicators -->
                            <ol class="carousel-indicators">
                                <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
                                <li data-target="#carousel-example-generic" data-slide-to="1"></li>
                                <li data-target="#carousel-example-generic" data-slide-to="2"></li>

                            </ol>

                            <!-- Wrapper for slides -->
                            <div class="carousel-inner">
                                <div class="item active">
                                    <img src="@/assets/images/slider1.jpg"  alt="...">
                                    <div class="carousel-caption">
                                        
                                    </div>
                                </div>
                                <div class="item">
                                    <img src="@/assets/images/slider2.jpg" alt="...">
                                    <div class="carousel-caption">
                                        
                                    </div>
                                </div>
                                <div class="item">
                                
                                    <div class="carousel-caption">
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
        </section>

        <!-- ============ Social Section  ============= -->
      
        <section class="social_connect">
            <div class="text-content container"> 
                <div class="col-md-6">
                    <span class="social_heading">SÍGUENOS</span>
                    <ul class="social_icons">
                        <li><a class="icon-twitter color_animation" href="#" target="_blank"></a></li>
                        <li><a class="icon-github color_animation" href="#" target="_blank"></a></li>
                        <li><a class="icon-linkedin color_animation" href="#" target="_blank"></a></li>
                        <li><a class="icon-mail color_animation" href="#"></a></li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <span class="social_heading">O LLAMANOS</span>
                    <span class="social_info"><a class="color_animation" href="tel:883-335-6524">(941) 883-335-6524</a></span>
                </div>
            </div>
        </section>

        <!-- ============ Contact Section  ============= -->

        
</template>
