package com.softcommerce.views.uiregistercotizaciondet;

import com.softcommerce.beans.BeanAlmacen;
import com.softcommerce.beans.BeanAnexo;
import com.softcommerce.beans.BeanCliente;
import com.softcommerce.beans.BeanCotizacionCab;
import com.softcommerce.beans.BeanCotizacionDet;
import com.softcommerce.beans.BeanMoneda;
import com.softcommerce.beans.BeanPrecioItem;
import com.softcommerce.beans.BeanStock;
import com.softcommerce.beans.Usuario;
import com.softcommerce.conta.formularios.FormBuscarAnexo;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.tablas.TableModelCotizacionDet;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnCotizacionCab;
import com.softcommerce.reglasnegocio.RnItem;
import com.softcommerce.reglasnegocio.RnStock;
import com.softcommerce.util.combo.LoadCombo;
import com.softcommerce.util.FormatObject;
import com.toedter.calendar.JDateChooser;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.Frame;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.text.DateFormat;
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTextField;
import javax.swing.JToolBar;
import javax.swing.SwingConstants;

public class UiRegisterCotizacionDetImpl extends UiRegisterCotizacionDet {

    public UiRegisterCotizacionDetImpl(Frame arg0, Usuario usuario, BeanCotizacionCab wCotizacion) {
        super(arg0, usuario, wCotizacion);
    }
}
